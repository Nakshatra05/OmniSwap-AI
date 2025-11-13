// src/features/command/components/ConfirmationDialog.tsx
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
import { formatUnits } from "viem";
import { type QuoteState } from "../hooks/useCommandHandler";

type ConfirmationDialogProps = {
  quoteState: QuoteState | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  quoteState,
  isOpen,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  if (
    !quoteState ||
    !quoteState.quote?.srcToken ||
    !quoteState.quote?.dstToken
  ) {
    return null;
  }

  const { quote, fromAmount, originalPrompt } = quoteState;

  const formattedFromAmount = fromAmount;

  const formattedToAmount = formatUnits(
    BigInt(quote.dstAmount),
    quote.dstToken.decimals,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-2xl">
              🔄
            </div>
            <div>
              <DialogTitle className="text-xl">Confirm Swap</DialogTitle>
              <DialogDescription>
                Review your transaction before proceeding
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="my-4 space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Your command:</p>
            <p className="font-medium text-sm">"{originalPrompt}"</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You send</span>
              <span className="text-xl font-bold">
                {formattedFromAmount} {quote.srcToken.symbol}
              </span>
            </div>
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-background border-2 flex items-center justify-center text-lg">↓</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You receive</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formattedToAmount} {quote.dstToken.symbol}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold">
            Confirm Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
