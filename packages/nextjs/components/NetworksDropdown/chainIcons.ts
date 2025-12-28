import type { ComponentType } from "react";
import { NetworkEthereum, networkIcons } from "@web3icons/react";

const CHAIN_ID_TO_ICON: Record<number, keyof typeof networkIcons> = {
  1: "NetworkEthereum",
  10: "NetworkOptimism",
  8453: "NetworkBase",
  137: "NetworkPolygon",
  42161: "NetworkArbitrumOne",
  100: "NetworkGnosis",
  324: "NetworkZksync",
  534352: "NetworkScroll",
};

export function getChainIcon(chainId?: string | number): ComponentType<any> {
  if (typeof chainId !== "number") {
    return NetworkEthereum; // if chainId is undefined or string, fallback immediately
  }

  const iconName = CHAIN_ID_TO_ICON[chainId];
  if (iconName && iconName in networkIcons) {
    return networkIcons[iconName];
  }
  return NetworkEthereum;
}
