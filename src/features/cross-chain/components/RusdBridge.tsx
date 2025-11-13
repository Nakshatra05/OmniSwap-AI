"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRusdBridge } from "../useRusdcBridge";

export function RusdBridge() {
  const { isConnected, chainId } = useAccount();
  const {
    rusdBalance,
    isLoading,
    statusMessage,
    executeRusdSwap,
    mintRusd,
    supportedChains,
    currentChainConfig,
    switchChain,
  } = useRusdBridge();

  const [amount, setAmount] = useState("");
  const [destinationChainId, setDestinationChainId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationChainId) {
      executeRusdSwap(amount, parseInt(destinationChainId));
    }
  };

  if (!isConnected) {
    return null;
  }

  if (!currentChainConfig) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>RUSD Testnet Bridge</CardTitle>
                <CardDescription>
                    Your current network is not supported. Please switch to a supported testnet to begin.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button onClick={() => switchChain({ chainId: 84532 })}>Switch to Base Sepolia</Button>
                <Button variant="secondary" onClick={() => switchChain({ chainId: 43113 })}>Switch to Fuji</Button>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-gradient-to-br from-background/95 to-background/80 shadow-lg border-2">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl shadow-md">
            🌉
          </div>
          <div>
            <CardTitle className="text-xl">RUSD Testnet Bridge</CardTitle>
          </div>
        </div>
        <CardDescription className="space-y-3">
          <p>Swap the testnet token RUSD from <span className="font-semibold text-foreground">{currentChainConfig.name}</span> to another chain via OnlySwaps.</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <span className="text-sm">Your Balance: <strong className="text-base text-foreground">{parseFloat(rusdBalance).toFixed(4)} RUSD</strong></span>
            <Button variant="outline" size="sm" onClick={mintRusd} disabled={isLoading} className="sm:ml-auto">
              {isLoading ? "Minting..." : "Mint 1 RUSD"}
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount to Swap</label>
                <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    disabled={isLoading}
                    required
                />
            </div>
            <div className="flex-grow space-y-2">
                <label htmlFor="destination" className="text-sm font-medium">To Destination</label>
                <select
                    id="destination"
                    value={destinationChainId}
                    onChange={(e) => setDestinationChainId(e.target.value)}
                    disabled={isLoading}
                    required
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled>Select a chain</option>
                    {Object.entries(supportedChains)
                        .filter(([id]) => parseInt(id) !== chainId)
                        .map(([id, { name }]) => (
                            <option key={id} value={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading || !amount || !destinationChainId} className="w-full">
            {isLoading ? "Processing..." : "Bridge RUSD"}
          </Button>

          {isLoading && statusMessage && (
            <div className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
              <p>{statusMessage}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
