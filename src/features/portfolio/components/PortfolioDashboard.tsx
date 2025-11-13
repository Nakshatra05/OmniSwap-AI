// src/features/portfolio/components/PortfolioDashboard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetTable } from "./AssetTable";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export function PortfolioDashboard() {
  const { isConnected } = useAccount();
  const { data: assets, isLoading } = usePortfolio();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="w-full backdrop-blur-sm bg-gradient-to-br from-background/95 to-background/80 shadow-lg border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-md">
            💼
          </div>
          <div>
            <CardTitle className="text-xl">Your Portfolio</CardTitle>
            <CardDescription>
              {isConnected && isClient
                ? "Track all your assets across supported networks"
                : "Connect your wallet to view your holdings"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AssetTable assets={assets || []} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
