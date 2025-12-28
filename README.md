# EVM.SLOTS  
*A Smart Contract Storage Explorer for EVM Chains*

Built with 🏗 **Scaffold-ETH 2**

Inspect contract storage across multiple EVM chains and fetch on-chain values from RPC.
Whether a contract is **verified or unverified**, EVM.SLOTS lets you read raw storage slots directly from the RPC and understand a contract’s true internal state.

## ✨ Dashboard Previews

| 🎨 First page looks | 🎨 Storage Layout |
|---------------------|---------------------|
| <img src="https://github.com/user-attachments/assets/aa63639c-b712-4dca-a601-9e5d096c662d" width="400"/> | <img src="https://github.com/user-attachments/assets/86ab9925-c2b6-430f-a662-da2fce907ba4" width="400"/> |

| 🎨 Fetch Storage | 🎨 About Page |
|---------------------|---------------------|
| <img src="https://github.com/user-attachments/assets/255d787b-5a7a-4018-af6f-b360d5ca3c08" width="400"/> | <img src="https://github.com/user-attachments/assets/0fd64c2a-195c-4db3-8dda-ef0fa24e315a" width="400"/> |


## ❓ Why a Slot Explorer?

Not everything is accessible via contract methods (Private & internal variables, Mappings and dynamic arrays, Proxy contract storage,...). These values still exist on-chain — they’re just hidden behind storage slots. With evm.slots, you can get an insider view of a contract's slots.

## ✨ Features

- 🔎 **Raw Storage Slot Explorer**
  - Read any slot using `eth_getStorageAt.`
  - Works for **verified & unverified contracts**

- 🧠 **Decoded Storage Layout (Verified Contracts)**
  - Fetches metadata from **Sourcify**
  - Displays variable names, types, offsets, and slot indices

- 🗺️ **Mapping & Dynamic Array Explorers**
  - Compute storage slots for mappings and arrays
  - Indexed exploration of complex data structures

- 🧩 **Proxy-Aware**
  - Supports most common proxy patterns (For diamond proxy, slot explorers are available)
  - Resolves implementation storage

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
