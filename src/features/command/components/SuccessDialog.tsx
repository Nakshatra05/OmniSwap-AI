// src/features/command/components/SuccessDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type SuccessDialogProps = {
  txHash: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const BLOCK_EXPLORER_URLS: { [chainId: number]: string } = {
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  10: "https://optimistic.etherscan.io",
  42161: "https://arbiscan.io",
};

export function SuccessDialog({
  txHash,
  isOpen,
  onOpenChange,
}: SuccessDialogProps) {
  const { chainId } = useAccount();

  if (!isOpen || !txHash) {
    return null;
  }

  const explorerUrl = chainId ? BLOCK_EXPLORER_URLS[chainId] : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <CheckCircle2 className="h-20 w-20 text-green-500 relative z-10 animate-in zoom-in-50 duration-300" />
            </div>
            <DialogTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Transaction Successful!
            </DialogTitle>
            <DialogDescription className="mt-2">
              Your swap has been confirmed on-chain
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="my-4 text-center">
          {explorerUrl && (
            <Link
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm font-medium break-all"
            >
              <span>View on Block Explorer</span>
              <span>↗</span>
            </Link>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto px-8">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
