import { GoogleGenAI } from "@google/genai";
import {
  getSwapQuoteDeclaration,
  getTokenBalanceDeclaration,
} from "./functions";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const genAI = new GoogleGenAI({});

/**
 * ユーザープロンプトを解釈し、呼び出すべき関数とその引数を返す
 * @param prompt ユーザーが入力した自然言語のコマンド
 * @returns Geminiが判断した関数呼び出し情報、またはnull
 */
export async function getAiFunctionCall(prompt: string) {
  try {
    console.log("lite");
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        tools: [
          {
            functionDeclarations: [
              getSwapQuoteDeclaration,
              getTokenBalanceDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];
      console.log("Function Call Detected:", functionCall);
      return functionCall;
    } else {
      console.log("No function call detected. Text response:", response.text);
      return null;
    }
  } catch (error) {
    console.error("Gemini API Error in getAiFunctionCall:", error);
    throw new Error("Failed to get response from AI.");
  }
}
