"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import {
  ViemChainBackend,
  RouterClient,
  createBalanceOfCall,
  fetchRecommendedFees,
  createMintCall,
  BASE_TESTNET_SEPOLIA,
  AVAX_TESTNET_FUJI,
  Constants,
} from "onlyswaps-js";

const SUPPORTED_CHAINS: { [chainId: number]: { name: string; constants: Constants } } = {
  84532: { name: "Base Sepolia", constants: BASE_TESTNET_SEPOLIA },
  43113: { name: "Fuji (Avalanche Testnet)", constants: AVAX_TESTNET_FUJI },
};

export function useRusdBridge() {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [rusdBalance, setRusdBalance] = useState<string>("0.0");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const currentChainConfig = useMemo(() => (chainId ? SUPPORTED_CHAINS[chainId] : undefined), [chainId]);
  const rusdAddress = useMemo(() => currentChainConfig?.constants.RUSD_ADDRESS, [currentChainConfig]);

  const fetchBalance = useCallback(async () => {
    if (!address || !publicClient || !rusdAddress || !walletClient) {
      setRusdBalance("0.0");
      return;
    }
    try {
      const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
      const balanceCall = createBalanceOfCall({ token: rusdAddress, wallet: address });
      const balanceResult = await backend.staticCall(balanceCall);
      setRusdBalance(formatUnits(balanceResult, 18));
    } catch (error) {
      console.error("Failed to fetch RUSD balance:", error);
      setRusdBalance("0.0");
    }
  }, [address, publicClient, rusdAddress, walletClient]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const mintRusd = async () => {
    if (!walletClient || !publicClient || !rusdAddress || !address) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsLoading(true);
    setStatusMessage("Minting 1 RUSD...");
    try {
      const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
      const mintCall = createMintCall(rusdAddress);
      const receipt = await backend.sendTransaction(mintCall);

      if (receipt.status === 'success') {
        setStatusMessage("Mint successful! Fetching new balance...");
        alert("Successfully minted 1 RUSD!");
        await fetchBalance();
      } else {
          throw new Error("Mint transaction failed.");
      }
    } catch (error) {
      console.error("Failed to mint RUSD:", error);
      alert(`Minting failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const executeRusdSwap = async (amount: string, destinationChainId: number) => {
    if (!address || !chainId || !publicClient || !walletClient || !currentChainConfig || !rusdAddress) {
      alert("Please connect your wallet and ensure you are on a supported network.");
      return;
    }

    const destinationChainConfig = SUPPORTED_CHAINS[destinationChainId];
    if (!destinationChainConfig?.constants.RUSD_ADDRESS) {
      alert("Destination chain is not supported for RUSD swap.");
      return;
    }
    const destinationRusdAddress = destinationChainConfig.constants.RUSD_ADDRESS;

    setIsLoading(true);
    try {
      setStatusMessage("Fetching cross-chain fees...");
      const amountInSmallestUnit = parseUnits(amount, 18);
      
      const fees = await fetchRecommendedFees({
        sourceToken: rusdAddress,
        destinationToken: destinationRusdAddress,
        sourceChainId: BigInt(chainId),
        destinationChainId: BigInt(destinationChainId),
        amount: amountInSmallestUnit,
      });

      const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
      const routerClient = new RouterClient({ routerAddress: currentChainConfig.constants.ROUTER_ADDRESS }, backend);
      
      setStatusMessage("Please approve RUSD spending...");
      const swapResponse = await routerClient.swap({
        recipient: address,
        srcToken: rusdAddress,
        destToken: destinationRusdAddress,
        amount: fees.transferAmount,
        fee: fees.fees.solver,
        destChainId: BigInt(destinationChainId),
      });

      setStatusMessage(`Swap initiated! Request ID: ${swapResponse.requestId}`);
      alert(`Swap successful! Request ID: ${swapResponse.requestId}`);
    } catch (error) {
      console.error("RUSD cross-chain swap failed:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return {
    rusdBalance,
    isLoading,
    statusMessage,
    executeRusdSwap,
    mintRusd,
    supportedChains: SUPPORTED_CHAINS,
    currentChainConfig,
    switchChain,
  };
}
