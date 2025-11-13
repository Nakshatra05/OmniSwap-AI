// src/features/command/hooks/useCommandHandler.ts
"use client";

import { config } from "@/features/wallet/providers/Web3Providers";
import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";

export type QuoteState = {
  quote: any; // 1inchからの見積もりレスポンス全体
  fromAmount: string; // ユーザーが入力したスワップ元の数量
  originalPrompt: string; // ユーザーが入力した元のコマンド
};

export function useCommandHandler() {
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [quoteState, setQuoteState] = useState<QuoteState | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  const { sendTransactionAsync } = useSendTransaction();

  const sendCommand = async (prompt: string) => {
    if (!address || !chainId) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setQuoteState(null);

    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, chainId, walletAddress: address }),
      });
      const data = await res.json();

      console.log("useCommandHandler");
      if (data.type === "quote_received" && data.quote && !data.quote.error) {
        console.log("success", data);
        setQuoteState({
          quote: data.quote,
          fromAmount: data.fromAmount,
          originalPrompt: data.originalPrompt,
        });
        setIsDialogOpen(true);
      } else {
        console.log("error");
        // 見積もり以外のレスポンス（エラーなど）
        const errorMessage =
          data.quote?.description ||
          data.message ||
          "An unknown error occurred.";
        // TODO: alertをshadcn/uiのToastに置き換える
        alert(`Error: ${errorMessage}`);
        console.log("API Response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch from /api/command", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSwap = async () => {
    if (!quoteState || !address || !chainId) return;

    setIsDialogOpen(false);
    setIsLoading(true);

    try {
      // 1. Allowanceを確認
      setStatusMessage("Checking allowance...");
      const allowanceRes = await fetch("/api/command", {
        method: "POST",
        body: JSON.stringify({
          action: "check_allowance",
          quoteState,
          chainId,
          walletAddress: address,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const { allowance, requiredAmount } = await allowanceRes.json();
      console.log(`allowance: ${allowance}, requiredAmount: ${requiredAmount}`);

      // 2. Allowanceが不足していればApproveを実行
      if (BigInt(allowance) < BigInt(requiredAmount)) {
        setStatusMessage("Allowance is insufficient. Approving token...");

        // 2a. Approveトランザクションデータを取得
        const approveTxRes = await fetch("/api/command", {
          method: "POST",
          body: JSON.stringify({
            action: "get_approve_transaction",
            tokenAddress: quoteState.quote.srcToken.address,
            chainId,
            walletAddress: address,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const approveTxData = await approveTxRes.json();

        // 2b. Approveトランザクションを送信
        const approveTxHash = await sendTransactionAsync(approveTxData.tx);

        // 2c. Approveトランザクションの完了を待つ
        setStatusMessage("Waiting for approval confirmation...");
        await waitForTransactionReceipt(config, { hash: approveTxHash });
      }

      // 3. Swapトランザクションを実行
      setStatusMessage("Proceeding to swap...");
      const swapTxRes = await fetch("/api/command", {
        method: "POST",
        body: JSON.stringify({
          action: "execute_swap",
          quoteState,
          chainId,
          walletAddress: address,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const swapTxData = await swapTxRes.json();

      const swapTxHash = await sendTransactionAsync(swapTxData.tx);
      setStatusMessage("Waiting for swap confirmation...");
      await waitForTransactionReceipt(config, { hash: swapTxHash });

      setSuccessTxHash(swapTxHash);
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error("Swap process failed", error);
      alert("An error occurred during the swap process.");
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return {
    sendCommand,
    isLoading,
    statusMessage,
    quoteState,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirmSwap,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
    successTxHash,
  };
}
