import { createPublicClient, fallback, http } from "viem";
import * as chains from "viem/chains";

export function getPublicClient(chainId: number) {
  const chain = Object.values(chains).find(c => c.id === chainId);
  if (!chain) throw new Error("Unsupported chain");

  return createPublicClient({
    chain,
    transport: fallback([
      http(), // default public RPC
    ]),
  });
}
