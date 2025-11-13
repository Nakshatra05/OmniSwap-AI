// src/lib/1inch/sdk.ts
import { parseUnits } from "viem";

/**
 * 指定されたウォレットアドレスのトークン残高を取得
 * @param chainId - 取得対象のブロックチェーンID
 * @param walletAddress - トークン残高を取得するウォレットのアドレス
 * @returns ウォレットのトークン残高のオブジェクト
 */
export async function getWalletBalances(
  chainId: number,
  walletAddress: string,
): Promise<Record<string, string>> {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  const url = `https://api.1inch.dev/balance/v1.2/${chainId}/balances/${walletAddress}`;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch token balances:", errorData);
      throw new Error(
        `Failed to fetch token balances. Status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching wallet balances:", error);
    throw error;
  }
}

/**
 * 指定されたトークンアドレスのリストに対応する価格を取得
 * @param chainId - 取得対象のブロックチェーンID
 * @param tokenAddresses - 価格を取得したいトークンのアドレスの配列
 * @returns トークンアドレスをキー、価格を値とするオブジェクト
 */
export async function getTokensPrices(
  chainId: number,
  tokenAddresses: string[],
): Promise<Record<string, string>> {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  try {
    // 各アドレスに対して個別に価格取得APIを呼び出すプロミスの配列を作成
    const fetchPromises = tokenAddresses.map(async (address) => {
      const url = `https://api.1inch.dev/price/v1.1/${chainId}/${address}?currency=USD`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch price for token ${address}: ${response.status}`,
        );
        // エラーの場合は、このトークンの価格をnullとして扱う
        return null;
      }
      // レスポンスは {"0x...": "price"} の形式なのでそのまま返す
      return await response.json();
    });

    // すべての価格取得リクエストを並列で実行
    const results = await Promise.all(fetchPromises);

    // 結果を一つのオブジェクトに統合
    const pricesMap: Record<string, string> = {};
    results.forEach((priceObject) => {
      if (priceObject) {
        Object.assign(pricesMap, priceObject);
      }
    });

    return pricesMap;
  } catch (error) {
    console.error("An error occurred while fetching token prices:", error);
    throw error;
  }
}

/**
 * 1inch Swap APIからスワップの見積もり（クオート）を取得
 * @param chainId チェーンID
 * @param fromTokenAddress スワップ元のトークンアドレス
 * @param toTokenAddress スワップ先のトークンアドレス
 * @param amount スワップする量（フォーマットされていない人間が読める単位、例: "1.5"）
 * @param fromAddress スワップを実行するユーザーのウォレットアドレス
 * @returns 1inch APIからのスワップ見積もりデータ
 */
export async function getSwapQuote(
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
) {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  // APIは最小単位の数値を要求するため、量を変換（ここでは仮に18桁）
  // TODO: 本来は各トークンのdecimalsに合わせて変換する必要がある
  const amountInSmallestUnit = parseUnits(amount, 18).toString();

  const params = new URLSearchParams({
    src: fromTokenAddress,
    dst: toTokenAddress,
    amount: amountInSmallestUnit,
    includeTokensInfo: "true",
  });

  const url = `https://api.1inch.dev/swap/v6.1/${chainId}/quote?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch swap quote:", errorData);
      throw new Error(`Failed to fetch swap quote. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching swap quote:", error);
    throw error;
  }
}

/**
 * 指定されたトークンのAllowance（許可額）を確認
 * @param chainId チェーンID
 * @param tokenAddress 確認するトークンのアドレス
 * @param walletAddress ユーザーのウォレットアドレス
 * @returns 許可額（最小単位の文字列）
 */
export async function checkAllowance(
  chainId: number,
  tokenAddress: string,
  walletAddress: string,
) {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("ONEINCH_API_KEY is not set in environment variables.");
  }

  const params = new URLSearchParams({
    tokenAddress,
    walletAddress,
  });

  // const url = `https://api.1inch.dev/approve/v6.0/${chainId}/allowance?${params.toString()}`;
  const url = `https://api.1inch.dev/swap/v6.1/${chainId}/approve/allowance?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Failed to check allowance:", errorData);
    throw new Error(`Failed to check allowance. Status: ${response.status}`);
  }
  const data = await response.json();
  return data.allowance;
}

/**
 * トークンをApprove（承認）するためのトランザクションデータを取得
 * @param chainId チェーンID
 * @param tokenAddress Approveするトークンのアドレス
 * @param amount 承認する数量（オプション、無制限にする場合は指定しない）
 * @returns Approve用のトランザクションデータ
 */
export async function getApproveTransaction(
  chainId: number,
  tokenAddress: string,
  amount?: string,
) {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("ONEINCH_API_KEY is not set in environment variables.");
  }

  const params: Record<string, string> = { tokenAddress };
  if (amount) {
    params.amount = amount;
  }

  // const url = `https://api.1inch.dev/approve/v6.0/${chainId}/transaction?${new URLSearchParams(
  //   params,
  // ).toString()}`;
  const url = `https://api.1inch.dev/swap/v6.1/${chainId}/approve/transaction?${new URLSearchParams(
    params,
  ).toString()}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Failed to get approve transaction:", errorData);
    throw new Error(
      `Failed to get approve transaction. Status: ${response.status}`,
    );
  }
  return await response.json();
}

/**
 * 1inch Swap APIからスワップを実行するためのトランザクションデータを取得
 * @param chainId チェーンID
 * @param fromTokenAddress スワップ元のトークンアドレス
 * @param toTokenAddress スワップ先のトークンアドレス
 * @param amount スワップする量（フォーマットされていない人間が読める単位、例: "1.5"）
 * @param fromAddress スワップを実行するユーザーのウォレットアドレス
 * @returns 1inch APIからのスワップトランザクションデータ
 */

export async function getSwapTransactionData(
  chainId: number,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fromAddress: string,
) {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("1INCH_API_KEY is not set in environment variables.");
  }

  // TODO: 本来は各トークンのdecimals（小数点以下の桁数）に合わせて変換する必要がありますが、
  const amountInSmallestUnit = parseUnits(amount, 18).toString();

  const params = new URLSearchParams({
    src: fromTokenAddress,
    dst: toTokenAddress,
    amount: amountInSmallestUnit,
    from: fromAddress,
    origin: fromAddress,
    slippage: "1", // スリッページ許容度を1%に設定
  });

  const url = `https://api.1inch.dev/swap/v6.1/${chainId}/swap?${params.toString()}`;

  try {
    console.log("fetch getSwapTransactionData");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    console.log("success getSwapTransactionData");

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to fetch swap data:", errorData);
      throw new Error(`Failed to fetch swap quote. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching swap data:", error);
    throw error;
  }
}

/**
 * @param chainId チェーンID
 * @param tokenAddresses 情報を取得したいトークンのアドレスの配列
 * @returns トークンアドレスをキー、トークン情報を値とするオブジェクト
 */
export async function getTokensInfo(
  chainId: number,
  tokenAddresses: string[],
): Promise<Record<string, any>> {
  const apiKey = process.env.ONEINCH_API_KEY;
  if (!apiKey) {
    throw new Error("ONEINCH_API_KEY is not set in environment variables.");
  }

  try {
    const fetchPromises = tokenAddresses.map(async (address) => {
      const url = `https://api.1inch.dev/token/v1.2/${chainId}/custom/${address}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch info for token ${address}: ${response.status}`,
        );
        return null;
      }
      return await response.json();
    });

    const results = await Promise.all(fetchPromises);

    const tokensMap: Record<string, any> = {};
    results.forEach((token) => {
      if (token && token.address) {
        tokensMap[token.address.toLowerCase()] = token;
      }
    });

    return tokensMap;
  } catch (error) {
    console.error("An error occurred while fetching tokens info:", error);
    throw error;
  }
}
