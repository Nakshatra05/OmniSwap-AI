# OmniSwap AI – All-Chain, All-Intent Swapping Agent

OmniSwap AI is an intelligent DeFi automation agent that transforms natural language into on-chain swap and liquidity actions — powered by Gemini, OnlySwaps, and dcipher.
It enables users and protocols to execute cross-chain intents without manual configuration, liquidity management, or bridge dependencies.

---

## Overview

OmniSwap AI is built to simplify DeFi operations by allowing users to express actions like:

> "Swap 30 USDC on Base to AVAX on Avalanche Fuji and rebalance my treasury."

The agent understands natural language, determines optimal execution paths, signs transactions via BLS signatures using dcipher, and performs cross-chain swaps using OnlySwaps' decentralized infrastructure.

---

## Key Features

* **Natural Language Swapping**: Executes swap, bridge, and rebalance actions based on plain-text user inputs.
* **All-Chain Compatibility**: Works across multiple EVM-compatible chains, powered by OnlySwaps' protocol.
* **Decentralized Verification**: Uses dcipher’s BLS threshold signatures for secure, trust-minimized validation.
* **AI Reasoning Core**: Google Gemini parses user intent and generates structured on-chain execution plans.
* **Autonomous Execution**: Once deployed, the agent can run continuously, monitor conditions, and perform rebalancing.

---

## Architecture

| Layer                  | Component       | Description                                     |
| ---------------------- | --------------- | ----------------------------------------------- |
| **Intent Layer**       | Gemini          | Interprets user prompts into actionable intents |
| **Planning Layer**     | OmniSwap Agent  | Translates intents into executable steps        |
| **Execution Layer**    | OnlySwaps SDK    | Handles routing and transaction dispatch        |
| **Verification Layer** | dcipher Network | Ensures decentralized signing and consensus     |

---

## Example Use Cases

* Cross-chain treasury management and auto-rebalancing
* Liquidity migration between EVM-compatible chains
* Multi-chain portfolio swaps using natural language
* Autonomous DeFi strategy execution for DAOs or funds

---

## Setup

### Prerequisites

* Node.js 18+
* MetaMask or other EVM-compatible wallet
* OnlySwaps-JS Library
* Gemini API key
* dcipher SDK credentials

---

### Quick Start

```bash
git clone https://github.com/Nakshatra05/omniswap-ai.git
cd omniswap-ai
npm install
```

Create a `.env` file in the root directory:

```
GEMINI_API_KEY=your_gemini_key
ONEINCH_API_KEY=your_oneinch_key
DCIPHER_API_KEY=your_dcipher_key
```

Then run the agent:

```bash
node index.js
npm run dev
```

---

## Example Prompt

```bash
"Swap 500 USDC from Base to Arbitrum and send to my multisig."
```

The agent will:

1. Parse the instruction using Gemini
2. Fetch optimal swap and routing data from OnlySwaps
3. Verify the operation through dcipher’s BLS network
4. Execute the transaction automatically

---

## Roadmap

* [ ] Multi-agent orchestration for parallel execution
* [ ] Telegram and Discord interface for conversational swaps
* [ ] Autonomous yield strategy integration
* [ ] Advanced reasoning with contextual memory
* [ ] Deployment on Filecoin Onchain Cloud for permanence

## License

This project is licensed under the MIT License.
