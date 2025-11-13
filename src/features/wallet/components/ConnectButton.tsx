// src/features/wallet/components/ConnectButton.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (isConnected) {
    return (
      <Button
        onClick={() => disconnect()}
        variant="outline"
        className="font-mono font-semibold border-2 hover:bg-destructive/10 hover:border-destructive/50 transition-all"
      >
        <span className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: injected() })}
      className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
    >
      Connect Wallet
    </Button>
  );
}
