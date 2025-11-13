"use client";

import { useState, useMemo } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseUnits } from "viem";
import {
  ViemChainBackend,
  RouterClient,
  fetchRecommendedFees,
  BASE_TESTNET_SEPOLIA,
  AVAX_TESTNET_FUJI,
  Constants,
} from "onlyswaps-js";

const SUPPORTED_CHAINS: { [chainId: number]: { name: string; constants: Constants } } = {
  84532: { name: "Base Sepolia", constants: BASE_TESTNET_SEPOLIA },
  43113: { name: "Fuji (Avalanche Testnet)", constants: AVAX_TESTNET_FUJI },
};

export function useRusdCommandHandler() {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const currentChainConfig = useMemo(() => (chainId ? SUPPORTED_CHAINS[chainId] : undefined), [chainId]);
  const rusdAddress = useMemo(() => currentChainConfig?.constants.RUSD_ADDRESS, [currentChainConfig]);

  const sendRusdCommand = async (prompt: string) => {
    if (!address || !chainId || !publicClient || !walletClient || !currentChainConfig || !rusdAddress) {
      alert("Please connect your wallet and ensure you are on a supported network.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Analyzing your command and checking conditions...");

    try {
      const intentRes = await fetch("/api/rusd-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const intentData = await intentRes.json();
      
      if (intentData.type === "condition_not_met") {
        setStatusMessage("");
        alert(intentData.message);
        return;
      }

      if (intentData.type !== "rusd_swap_intent") {
        throw new Error(intentData.message || "Could not understand the command.");
      }
      
      const { amount, destinationChainId, message: conditionMetMessage } = intentData;
      setStatusMessage(conditionMetMessage);
      alert(conditionMetMessage);

      if (chainId === destinationChainId) {
          throw new Error("You can't bridge to the same chain you are currently on.");
      }

      const destinationChainConfig = SUPPORTED_CHAINS[destinationChainId];
      const destinationRusdAddress = destinationChainConfig?.constants.RUSD_ADDRESS;
      if (!destinationRusdAddress) throw new Error("Destination chain is not configured correctly.");

      setStatusMessage("Fetching cross-chain fees...");
      const amountInSmallestUnit = parseUnits(amount, 18);
      const fees = await fetchRecommendedFees({
        sourceToken: rusdAddress,
        destinationToken: destinationRusdAddress,
        sourceChainId: BigInt(chainId),
        destinationChainId: BigInt(destinationChainId),
        amount: amountInSmallestUnit,
      });

      const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
      const routerClient = new RouterClient({ routerAddress: currentChainConfig.constants.ROUTER_ADDRESS }, backend);
      
      setStatusMessage("Please approve RUSD spending in your wallet...");
      const swapResponse = await routerClient.swap({
        recipient: address,
        srcToken: rusdAddress,
        destToken: destinationRusdAddress,
        amount: fees.transferAmount,
        fee: fees.fees.solver,
        destChainId: BigInt(destinationChainId),
      });

      setStatusMessage(`Swap initiated successfully! Request ID: ${swapResponse.requestId}`);
      alert(`Swap successful! Request ID: ${swapResponse.requestId}`);

    } catch (error) {
      console.error("RUSD AI command failed:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return {
    sendRusdCommand,
    isLoading,
    statusMessage,
  };
}
