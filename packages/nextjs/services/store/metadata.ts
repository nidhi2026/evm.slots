import { create } from "zustand";

type ContractMetadataState = {
  isVerified: boolean;
  isProxy: boolean;
  proxyType: string | null;
  implementationAddress: string | null;
  storageLayout: any | null;
  compilation: any | null;
  isStorageFetched: boolean;
  deployment: any | null;

  setMetadata: (data: Partial<ContractMetadataState>) => void;
  reset: () => void;
};

export const useContractMetadata = create<ContractMetadataState>(set => ({
  isVerified: false,
  isProxy: false,
  proxyType: null,
  implementationAddress: null,
  storageLayout: null,
  compilation: null,
  isStorageFetched: false,
  deployment: null,

  setMetadata: data => set(data),
  reset: () =>
    set({
      isVerified: false,
      isProxy: false,
      proxyType: null,
      implementationAddress: null,
      storageLayout: null,
      compilation: null,
      isStorageFetched: false,
      deployment: null,
    }),
}));
