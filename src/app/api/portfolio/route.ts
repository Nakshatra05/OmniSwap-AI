// src/app/api/portfolio/route.ts

import { NextResponse } from "next/server";
import {
  getWalletBalances,
  getTokensPrices,
  getTokensInfo,
} from "@/lib/1inch/sdk";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("address");
    const chainIdStr = searchParams.get("chainId");

    if (!walletAddress || !chainIdStr) {
      return NextResponse.json(
        { error: "Missing address or chainId query parameter" },
        { status: 400 },
      );
    }
    const chainId = parseInt(chainIdStr, 10);

    // 1. ウォレットの残高を取得
    const allBalances = await getWalletBalances(chainId, walletAddress);
    const addressesWithBalance = Object.keys(allBalances).filter(
      (address) => BigInt(allBalances[address]) > 0,
    );

    if (addressesWithBalance.length === 0) {
      return NextResponse.json([]);
    }

    // 2. 残高のある全てのアドレスの価格と詳細情報を並行して取得
    const [prices, tokensInfo] = await Promise.all([
      getTokensPrices(chainId, addressesWithBalance),
      getTokensInfo(chainId, addressesWithBalance),
    ]);

    // 3. フロントエンド用のデータを作成
    const portfolioData = addressesWithBalance.map((address) => {
      const lowerCaseAddress = address.toLowerCase();
      return {
        address,
        balance: allBalances[address],
        price: prices[address] || "0",
        tokenInfo: tokensInfo[lowerCaseAddress] || null,
      };
    });

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
