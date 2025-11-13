// src/lib/tokens.ts

const TOKENS_BY_CHAIN: { [chainId: number]: { [symbol: string]: string } } = {
  1: {
    // Ethereum Mainnet
    ETH: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  137: {
    // Polygon Mainnet
    MATIC: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    WETH: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
};

/**
 * トークンシンボルとチェーンIDからコントラクトアドレスを取得
 * @param symbol トークンシンボル (e.g., "USDC")
 * @param chainId チェーンID
 * @returns コントラクトアドレス or undefined
 */
export function getTokenAddress(
  symbol: string,
  chainId: number,
): string | undefined {
  const upperSymbol = symbol.toUpperCase();
  if (upperSymbol === "ETH" && chainId === 1) {
    return TOKENS_BY_CHAIN[chainId]?.["ETH"];
  }
  if (upperSymbol === "MATIC" && chainId === 137) {
    return TOKENS_BY_CHAIN[chainId]?.["MATIC"];
  }
  return TOKENS_BY_CHAIN[chainId]?.[upperSymbol];
}

export const NATIVE_ASSET_INFO_BY_CHAIN: {
  [chainId: number]: {
    symbol: string;
    name: string;
    decimals: number;
    logoURI: string;
  };
} = {
  1: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoURI:
      "https://token.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
  },
  137: {
    symbol: "MATIC",
    name: "Matic Token",
    decimals: 18,
    logoURI:
      "https://token.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
  },
};
