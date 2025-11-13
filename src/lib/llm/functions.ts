import { Type } from "@google/genai";

/**
 * Geminiに関数の仕様を教えるためのFunction Declaration
 */
export const getSwapQuoteDeclaration = {
  name: "get_swap_quote",
  description: "Gets a swap quote for two tokens.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fromToken: {
        type: Type.STRING,
        description: "The symbol of the token to sell, e.g., 'ETH', 'USDC'",
      },
      toToken: {
        type: Type.STRING,
        description: "The symbol of the token to buy, e.g., 'DAI', 'WBTC'",
      },
      amount: {
        type: Type.STRING,
        description: "The amount of the `fromToken` to sell, e.g., '1.5'",
      },
    },
    required: ["fromToken", "toToken", "amount"],
  },
};

/**
 * 特定トークンの残高を取得するためのFunction Declaration
 */
export const getTokenBalanceDeclaration = {
  name: "get_token_balance",
  description: "Gets the balance of a specific token in the user's wallet.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenSymbol: {
        type: Type.STRING,
        description: "The symbol of the token to check, e.g., 'ETH', 'USDC'",
      },
    },
    required: ["tokenSymbol"],
  },
};
