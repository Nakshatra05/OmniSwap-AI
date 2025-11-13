"use client";

import { useCommandHandler } from "@/features/command/hooks/useCommandHandler";
import { useRusdCommandHandler } from "../rusds/useRusdCommandHandler";

export function useMasterCommandHandler() {
  const oneInch = useCommandHandler();
  const onlySwaps = useRusdCommandHandler();

  const sendMasterCommand = (prompt: string) => {
    if (prompt.toLowerCase().includes("rusd")) {
      onlySwaps.sendRusdCommand(prompt);
    } else {
      oneInch.sendCommand(prompt);
    }
  };

  const isLoading = oneInch.isLoading || onlySwaps.isLoading;

  const statusMessage = oneInch.isLoading ? oneInch.statusMessage : onlySwaps.statusMessage;

  return {
    sendMasterCommand,
    isLoading,
    statusMessage,
    quoteState: oneInch.quoteState,
    isDialogOpen: oneInch.isDialogOpen,
    setIsDialogOpen: oneInch.setIsDialogOpen,
    handleConfirmSwap: oneInch.handleConfirmSwap,
    isSuccessDialogOpen: oneInch.isSuccessDialogOpen,
    setIsSuccessDialogOpen: oneInch.setIsSuccessDialogOpen,
    successTxHash: oneInch.successTxHash,
  };
}
