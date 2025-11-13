// src/app/api/command/route.ts

import { NextResponse } from "next/server";
import { getAiFunctionCall } from "@/lib/llm/client";
import {
  checkAllowance,
  getApproveTransaction,
  getSwapQuote,
  getSwapTransactionData,
} from "@/lib/1inch/sdk";
import { getTokenAddress } from "@/lib/tokens";
import { parseUnits } from "viem";

type GetSwapQuoteArgs = {
  fromToken: string;
  toToken: string;
  amount: string;
};

type GetTokenBalanceArgs = {
  tokenSymbol: string;
};

export async function POST(request: Request) {
  try {
    const { prompt, chainId, walletAddress, action, quoteState, tokenAddress } =
      await request.json();
    console.log(
      `prompt: ${prompt}, chainId: ${chainId}, walletAddress: ${walletAddress}`,
    );

    if (!chainId || !walletAddress) {
      return NextResponse.json(
        { error: "chainId, and walletAddress are required" },
        { status: 400 },
      );
    }

    if (action === "check_allowance") {
      const { srcToken } = quoteState.quote;
      const { fromAmount } = quoteState;
      const amountInSmallestUnit = parseUnits(fromAmount, srcToken.decimals);

      const allowance = await checkAllowance(
        chainId,
        srcToken.address,
        walletAddress,
      );

      return NextResponse.json({
        type: "allowance_checked",
        allowance,
        requiredAmount: amountInSmallestUnit.toString(),
      });
    }

    if (action === "get_approve_transaction") {
      const txData = await getApproveTransaction(chainId, tokenAddress);
      return NextResponse.json({ type: "approve_transaction", tx: txData });
    }

    if (action === "execute_swap") {
      if (!quoteState) {
        return NextResponse.json(
          { error: "quoteState is required for execution" },
          { status: 400 },
        );
      }

      const { srcToken, dstToken } = quoteState.quote;
      const { fromAmount } = quoteState;

      if (!srcToken || !dstToken) {
        return NextResponse.json(
          { error: "Invalid quote state provided" },
          { status: 400 },
        );
      }

      console.log("POST getSwapTransactionData");
      const txData = await getSwapTransactionData(
        chainId,
        srcToken.address,
        dstToken.address,
        fromAmount,
        walletAddress,
      );

      return NextResponse.json({
        type: "transaction_data",
        tx: txData.tx,
      });
    }

    const functionCall = await getAiFunctionCall(prompt);

    if (functionCall) {
      if (functionCall.name === "get_swap_quote") {
        const args = functionCall.args as GetSwapQuoteArgs;
        const { fromToken, toToken, amount } = args;

        const fromTokenAddress = getTokenAddress(fromToken, chainId);
        const toTokenAddress = getTokenAddress(toToken, chainId);

        if (!fromTokenAddress || !toTokenAddress) {
          return NextResponse.json(
            { type: "error", message: "Unsupported token specified." },
            { status: 400 },
          );
        }

        console.log(`Getting quote for ${amount} ${fromToken} -> ${toToken}`);

        const quote = await getSwapQuote(
          chainId,
          fromTokenAddress,
          toTokenAddress,
          amount,
        );

        return NextResponse.json({
          type: "quote_received",
          quote,
          fromAmount: amount,
          originalPrompt: prompt,
        });
      }

      if (functionCall.name === "get_token_balance") {
        const args = functionCall.args as GetTokenBalanceArgs;
        return NextResponse.json({
          type: "info",
          message: `Balance check for ${args.tokenSymbol} is not implemented yet.`,
        });
      }
    }

    return NextResponse.json({
      type: "no_action",
      message: "Could not determine an action from your command.",
    });
  } catch (error) {
    console.error("Error in /api/command:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
