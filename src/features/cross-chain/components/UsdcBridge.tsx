"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsdcBridge } from "../useUsdcBridge";

export function UsdcBridge() {
  const { isConnected, chainId } = useAccount();
  const {
    usdcBalance,
    isLoading,
    statusMessage,
    executeUsdcSwap,
    supportedChains,
    currentChainConfig,
    switchChain,
  } = useUsdcBridge();

  const [amount, setAmount] = useState("");
  const [destinationChainId, setDestinationChainId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationChainId) {
      executeUsdcSwap(amount, parseInt(destinationChainId));
    }
  };

  if (!isConnected) {
    return null;
  }

  if (!currentChainConfig) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>USDC Cross-Chain Bridge</CardTitle>
                <CardDescription>
                    Your current network is not supported by the USDC Bridge. Please switch to a supported network to begin.
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
    <Card>
      <CardHeader>
        <CardTitle>USDC Cross-Chain Bridge</CardTitle>
        <CardDescription>
          Swap USDC from {currentChainConfig.name} to another supported chain via OnlySwaps.
          <br />
          Your Balance: <strong>{parseFloat(usdcBalance).toFixed(4)} USDC</strong>
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
            {isLoading ? "Processing..." : "Bridge USDC"}
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
