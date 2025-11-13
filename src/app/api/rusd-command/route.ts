import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getTokensPrices } from "@/lib/1inch/sdk";
import { getTokenAddress } from "@/lib/tokens";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const conditionalBridgeDeclaration = {
  name: "execute_conditional_rusd_bridge",
  description: "Swaps, bridges, or sends RUSD testnet tokens only IF a specific market condition is met. Use for commands like 'Bridge 1 RUSD to Fuji if ETH price is above 2000 USDC'.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.STRING, description: "The amount of RUSD to bridge." },
      destinationChain: { type: Type.STRING, description: "The destination chain, e.g., 'Fuji' or 'Base Sepolia'." },
      conditionToken: { type: Type.STRING, description: "The token to check the price of, e.g., 'ETH'." },
      operator: { type: Type.STRING, description: "The comparison operator, either 'greater_than' or 'less_than'." },
      targetPrice: { type: Type.STRING, description: "The price to compare against, e.g., '2000'." },
    },
    required: ["amount", "destinationChain", "conditionToken", "operator", "targetPrice"],
  },
};

const chainNameToIdMap: { [key: string]: number } = {
  "fuji": 43113, "avalanche fuji": 43113,
  "base sepolia": 84532, "sepolia": 84532,
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
	config: {
        tools: [{ functionDeclarations: [conditionalBridgeDeclaration] }],}
    });

    const functionCall = response.functionCalls?.[0];

    if (functionCall?.name === 'execute_conditional_rusd_bridge') {
      const { amount, destinationChain, conditionToken, operator, targetPrice } = functionCall.args;
      const destinationChainId = chainNameToIdMap[(destinationChain as string).toLowerCase()];
      if (!destinationChainId) {
        return NextResponse.json({ type: "error", message: `Destination chain '${destinationChain}' is not supported.` }, { status: 400 });
      }

      const tokenAddress = getTokenAddress(conditionToken as string, 1);
      if (!tokenAddress) {
        return NextResponse.json({ type: "error", message: `Could not find address for token ${conditionToken}.` }, { status: 400 });
      }
      
      const prices = await getTokensPrices(1, [tokenAddress]);
      const currentPrice = parseFloat(prices[tokenAddress]);
      const numericTargetPrice = parseFloat(targetPrice as string);

      let isConditionMet = false;
      if (operator === 'greater_than') {
        isConditionMet = currentPrice > numericTargetPrice;
      } else if (operator === 'less_than') {
        isConditionMet = currentPrice < numericTargetPrice;
      } else {
        return NextResponse.json({ type: "error", message: `Unsupported operator: ${operator}.` }, { status: 400 });
      }
      
      if (isConditionMet) {
        return NextResponse.json({
          type: "rusd_swap_intent",
          amount,
          destinationChainId,
          message: `Condition met: ${conditionToken} price is $${currentPrice.toFixed(2)}. Proceeding with swap.`,
        });
      } else {
        return NextResponse.json({
          type: "condition_not_met",
          message: `Swap cancelled. Condition not met: ${conditionToken} price is $${currentPrice.toFixed(2)}, which is not ${operator.replace('_', ' ')} $${numericTargetPrice.toFixed(2)}.`,
        });
      }
    }

    return NextResponse.json({
      type: "no_action",
      message: "I couldn't understand that command. Please try a conditional swap like 'Bridge 1 RUSD to Fuji if ETH is greater than 2000'.",
    });

  } catch (error) {
    console.error("Error in /api/rusd-command:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
