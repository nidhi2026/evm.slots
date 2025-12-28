# EVM.SLOTS  
*A Smart Contract Storage Explorer for EVM Chains*

Built with 🏗 **Scaffold-ETH 2**

Inspect contract storage across multiple EVM chains and fetch on-chain values from RPC.
Whether a contract is **verified or unverified**, EVM.SLOTS lets you read raw storage slots directly from the RPC and understand a contract’s true internal state.

## ❓ Why a Storage Slot Explorer?

Not everything is accessible via contract methods (Private & internal variables, Mappings and dynamic arrays, Proxy contract storage,...). These values still exist on-chain — they’re just hidden behind storage slots.

**EVM.SLOTS bridges that gap** by making low-level EVM storage readable and explorable.

## ✨ Features

- 🔎 **Raw Storage Slot Explorer**
  - Read any slot using `eth_getStorageAt`
  - Works for **verified & unverified contracts**

- 🧠 **Decoded Storage Layout (Verified Contracts)**
  - Fetches metadata from **Sourcify**
  - Displays variable names, types, offsets, and slot indices

- 🗺️ **Mapping & Dynamic Array Explorers**
  - Compute storage slots for mappings and arrays
  - Indexed exploration of complex data structures

- 🧩 **Proxy-Aware**
  - Supports most common proxy patterns
  - Resolves implementation storage
  - Diamond proxy support in progress

- 🌐 **Multi-Chain Support**
  - Explore contracts across multiple EVM networks
  - Custom networks supported

## 🛠 Tech Stack

- **Next.js**
- **TypeScript**
- **Viem** – EVM RPC interactions
- **Sourcify API** – Verified contract metadata
- **Scaffold-ETH 2** – Project scaffolding & UI components

> No wallet connection required for exploration :)
