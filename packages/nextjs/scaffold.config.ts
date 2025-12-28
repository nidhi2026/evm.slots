import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  rpcOverrides?: Record<number, string>;
};

export type ScaffoldConfig = BaseConfig;

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [
    chains.mainnet,
    chains.sepolia,
    chains.optimism,
    chains.base,
    chains.baseSepolia,
    chains.polygon,
    chains.polygonMumbai,
    chains.arbitrum,
    chains.gnosis,
    chains.monadTestnet,
    chains.zksync,
    chains.scroll,
    chains.scrollSepolia,
  ],
  // The interval at which your front-end polls the RPC servers for new data (it has no effect if you only target the local network (default is 4000))
  pollingInterval: 30000,
  rpcOverrides: {
    // Example:
    // [chains.mainnet.id]: "https://mainnet.rpc.buidlguidl.com",
  },
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
