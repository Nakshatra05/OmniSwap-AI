// src/features/portfolio/hooks/usePortfolio.ts
"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "../components/AssetTable";

const fetchPortfolio = async (chainId?: number, address?: `0x${string}`) => {
  if (!chainId || !address) {
    throw new Error("Chain ID and address are required.");
  }

  const response = await fetch(
    `/api/portfolio?chainId=${chainId}&address=${address}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data.");
  }
  return response.json();
};

export function usePortfolio() {
  const { address, chainId, isConnected } = useAccount();

  return useQuery<Asset[]>({
    // TanStack Queryがデータをキャッシュ・管理するためのユニークなキー
    queryKey: ["portfolio", chainId, address],
    // データを取得するための非同期関数
    queryFn: () => fetchPortfolio(chainId, address),
    // クエリを有効にする条件。ウォレットが接続されている場合のみ実行する
    enabled: isConnected && !!chainId && !!address,
  });
}
