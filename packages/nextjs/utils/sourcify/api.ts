import { Address } from "viem";

export class SourcifyApiError extends Error {
  constructor(message = "Unable to fetch contract metadata from Sourcify", name = "SourcifyRequestFailed") {
    super(message);
    this.name = name;
  }
}

export type ContractMetadataResult = {
  isVerified: boolean;
  isProxy: boolean;
  proxyType: string | null;
  implementationAddress: Address | null;
  compilation: any | null;
  storageLayout: any | null;
  deployment: any | null;
};

export const fetchContractMetadataFromSourcify = async (
  contractAddress: Address,
  chainId: number,
): Promise<ContractMetadataResult> => {
  const fetchMetadata = async (addr: Address): Promise<any | null> => {
    const url = `https://sourcify.dev/server/v2/contract/${chainId}/${addr}?fields=all`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.status === 404) return null; // unverified contract
    if (!res.ok)
      throw new SourcifyApiError(
        data?.message ?? "Unable to fetch contract metadata from Sourcify",
        data?.customCode ?? "SourcifyRequestFailed",
      );

    return data;
  };

  const metadata = await fetchMetadata(contractAddress);

  // unverified contract
  if (!metadata) {
    return {
      isVerified: false,
      isProxy: false,
      proxyType: null,
      implementationAddress: null,
      compilation: null,
      storageLayout: null,
      deployment: null,
    };
  }

  // check for proxy
  const proxyInfo = metadata.proxyResolution;
  const isProxy = proxyInfo?.isProxy === true;

  // Sourcify uses whatsabi for proxyResolution. Generally returns single implementation except
  // for diamond (many facets)
  if (isProxy) {
    const proxyType = proxyInfo.proxyType;
    const implementations = proxyInfo?.implementations ?? [];

    // We are not supporting non-single implementation proxies for now
    if (implementations.length !== 1) {
      return {
        isVerified: false, // implementation not checked, defaulting to false
        isProxy: true,
        proxyType,
        implementationAddress: null, // no single storage authority
        compilation: metadata.compilation ?? null,
        storageLayout: null, // can't decode layout
        deployment: metadata.deployment ?? null,
      };
    }

    const implementationAddress = implementations[0].address;
    const implementationData = await fetchMetadata(implementationAddress);

    // proxy verified but implementation contract is not verified
    if (!implementationData) {
      return {
        isVerified: false,
        isProxy: true,
        proxyType: proxyType,
        implementationAddress: implementationAddress,
        compilation: metadata.compilation ?? null,
        storageLayout: null,
        deployment: metadata.deployment,
      };
    }

    // proxy and implementation both verified
    return {
      isVerified: true,
      isProxy: true,
      proxyType: proxyType,
      implementationAddress: implementationAddress,
      compilation: metadata.compilation ?? null,
      storageLayout: implementationData.storageLayout ?? null,
      deployment: metadata.deployment ?? null,
    };
  }

  // contract is verified
  return {
    isVerified: true,
    isProxy: false,
    proxyType: null,
    implementationAddress: null,
    compilation: metadata.compilation ?? null,
    storageLayout: metadata.storageLayout ?? null,
    deployment: metadata.deployment ?? null,
  };
};
