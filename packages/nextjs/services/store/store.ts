import { Chain } from "viem";
import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  chains: Chain[];
  addChain: (newChain: Chain) => void;
  removeChain: (chainId: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  chains: [...scaffoldConfig.targetNetworks],
  addChain: (newChain: Chain) =>
    set(state => {
      if (!state.chains.some((chain: Chain) => chain.id === newChain.id)) {
        return { chains: [...state.chains, newChain] };
      }
      return state;
    }),
  removeChain: (chainId: number) =>
    set(state => ({
      chains: state.chains.filter((chain: Chain) => chain.id !== chainId),
    })),
  targetNetwork: {
    ...scaffoldConfig.targetNetworks[0],
  },
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));

type ContractMetadataState = {
  isProxy: boolean;
  implementationAddress: string | null;
  storageLayout: any | null;
  compilation: any | null;

  setMetadata: (data: Partial<ContractMetadataState>) => void;
  reset: () => void;
};

export const useContractMetadata = create<ContractMetadataState>(set => ({
  isProxy: false,
  implementationAddress: null,
  storageLayout: null,
  compilation: null,

  setMetadata: data => set(data),
  reset: () =>
    set({
      isProxy: false,
      implementationAddress: null,
      storageLayout: null,
      compilation: null,
    }),
}));
