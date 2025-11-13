"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import { formatUnits, parseUnits, Address } from "viem";
import {
  ViemChainBackend,
  RouterClient,
  createBalanceOfCall,
  fetchRecommendedFees,
  BASE_MAINNET,
  AVAX_MAINNET,
  BASE_TESTNET_SEPOLIA,
  AVAX_TESTNET_FUJI,
  Constants,
} from "onlyswaps-js";

const SUPPORTED_CHAINS: { [chainId: number]: { name: string; constants: Constants } } = {
  8453: { name: "Base", constants: BASE_MAINNET },
  43114: { name: "Avalanche", constants: AVAX_MAINNET },
  84532: { name: "Base Sepolia", constants: BASE_TESTNET_SEPOLIA },
  43113: { name: "Fuji (Avalanche Testnet)", constants: AVAX_TESTNET_FUJI },
};

const USDC_ADDRESSES_BY_CHAIN: { [chainId: number]: Address } = {
  8453: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
  43114: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", 
};

export function useUsdcBridge() {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();

  const [usdcBalance, setUsdcBalance] = useState<string>("0.0");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const currentChainConfig = useMemo(() => (chainId ? SUPPORTED_CHAINS[chainId] : undefined), [chainId]);
  
  const usdcAddress = useMemo(() => (chainId ? USDC_ADDRESSES_BY_CHAIN[chainId] : undefined), [chainId]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !publicClient || !usdcAddress || !walletClient) {
        setUsdcBalance("0.0");
        return;
      }

      try {
        const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
        const balanceCall = createBalanceOfCall({
          token: usdcAddress,
          wallet: address,
        });
        const balanceResult = await backend.staticCall(balanceCall);
        setUsdcBalance(formatUnits(balanceResult, 6));
      } catch (error) {
        console.error("Failed to fetch USDC balance:", error);
        setUsdcBalance("0.0");
      }
    };

    fetchBalance();
  }, [address, chainId, publicClient, walletClient, usdcAddress]);

  const executeUsdcSwap = async (amount: string, destinationChainId: number) => {
    if (!address || !chainId || !publicClient || !walletClient || !currentChainConfig || !usdcAddress) {
      alert("Please connect your wallet and ensure you are on a supported network.");
      return;
    }

    const destinationUsdcAddress = USDC_ADDRESSES_BY_CHAIN[destinationChainId];
    if (!destinationUsdcAddress) {
        alert("USDC address not found for the destination chain. This swap is not supported yet.");
        return;
    }

    setIsLoading(true);
    
    try {
      setStatusMessage("Fetching cross-chain fees...");
      const amountInSmallestUnit = parseUnits(amount, 6);
      
      const fees = await fetchRecommendedFees({
        sourceToken: usdcAddress,
        destinationToken: destinationUsdcAddress,
        sourceChainId: BigInt(chainId),
        destinationChainId: BigInt(destinationChainId),
        amount: amountInSmallestUnit,
      });

      const backend = new ViemChainBackend(address, publicClient as any, walletClient as any);
      const routerClient = new RouterClient({ routerAddress: currentChainConfig.constants.ROUTER_ADDRESS }, backend);
      
      setStatusMessage("Please approve USDC spending...");
      const swapResponse = await routerClient.swap({
        recipient: address,
        srcToken: usdcAddress,
        destToken: destinationUsdcAddress,
        amount: fees.transferAmount,
        fee: fees.fees.solver,
        destChainId: BigInt(destinationChainId),
      });

      setStatusMessage(`Swap initiated! Request ID: ${swapResponse.requestId}`);
      console.log("Swap successful:", swapResponse);
      alert(`Swap successful! Your funds will arrive shortly. Request ID: ${swapResponse.requestId}`);

    } catch (error) {
      console.error("USDC cross-chain swap failed:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  return {
    usdcBalance,
    isLoading,
    statusMessage,
    executeUsdcSwap,
    supportedChains: SUPPORTED_CHAINS,
    currentChainConfig,
    switchChain,
  };
}
