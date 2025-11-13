"use client";

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { ConfirmationDialog } from "@/features/command/components/ConfirmationDialog";
import Image from "next/image";
import Link from "next/link";
import { SuccessDialog } from "@/features/command/components/SuccessDialog";
import { useMasterCommandHandler } from "@/features/master/useMasterCommandHandler";
import { NetworkSwitcher } from "@/features/wallet/components/NetworkSwitcher";
import { RusdBridge } from "@/features/cross-chain/components/RusdBridge";
import { MasterCommandBar } from "@/features/master/components/MasterCommandBar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppPage() {
  const {
    sendMasterCommand,
    isLoading,
    statusMessage,
    quoteState,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirmSwap,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
    successTxHash,
  } = useMasterCommandHandler();

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 pt-6 md:px-8 lg:px-24 md:pt-8 pb-12">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-green-950/20 pointer-events-none" />

      <header className="relative w-full max-w-6xl flex justify-between items-center backdrop-blur-sm bg-background/80 rounded-xl border p-4 shadow-sm mb-8">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg blur opacity-20" />
            <Image
              src="/logo.png"
              alt="OmniSwap AI Logo"
              width={44}
              height={44}
              className="rounded-lg relative z-10"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">OmniSwap AI</h1>
            <p className="text-xs text-muted-foreground">All-Chain, All-Intent Swapping</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NetworkSwitcher />
          <ConnectButton />
        </div>
      </header>

      <div className="relative w-full max-w-6xl flex flex-col gap-6">
        <div className="backdrop-blur-sm bg-gradient-to-br from-background/95 to-background/80 rounded-xl border shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              AI
            </div>
            <div>
              <h2 className="text-xl font-bold">Natural Language Command</h2>
              <p className="text-sm text-muted-foreground">Describe what you want to do, and AI will execute it</p>
            </div>
          </div>
          <MasterCommandBar onSubmitAction={sendMasterCommand} isLoading={isLoading} />
          {isLoading && statusMessage && (
            <div className="mt-4 flex items-center justify-center gap-2 text-center text-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-muted-foreground animate-pulse">{statusMessage}</p>
            </div>
          )}
        </div>

        <PortfolioDashboard />

        <RusdBridge />
      </div>

      <ConfirmationDialog
        quoteState={quoteState}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmSwap}
      />

      <SuccessDialog
        txHash={successTxHash}
        isOpen={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      />
    </main>
  );
}
