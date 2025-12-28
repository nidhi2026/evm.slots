"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Address } from "@scaffold-ui/components";
import { Address as AddressType, isAddress } from "viem";
import * as chains from "viem/chains";
import { DynamicArrayExplorer, MappingExplorer, NormalSlotExplorer } from "~~/components/StorageLayout/SlotExplorer";
import { StorageItem } from "~~/components/StorageLayout/SlotRow";
import StorageSlotRow from "~~/components/StorageLayout/SlotRow";
import { renderHighlightedValue } from "~~/components/StorageLayout/StorageValueRenderer";
import { useContractMetadata } from "~~/services/store/metadata";
import { getBlockExplorerAddressLink, notification } from "~~/utils/scaffold-eth";
import { SourcifyApiError, fetchContractMetadataFromSourcify } from "~~/utils/sourcify/api";

type Props = {
  addressFromUrl: AddressType | null;
  chainIdFromUrl: number | null;
};

type SelectedSlot = {
  slot: string;
  index: number;
  type: string;
  value?: string | null;
  offset: number;
  numberOfBytes: number;
  encoding: string;
  label: string;
  mappingKeyType: string;
  dynArrType: string;
};

export default function StorageLayoutClient({ addressFromUrl, chainIdFromUrl }: Props) {
  const router = useRouter();
  const {
    isVerified,
    isProxy,
    proxyType,
    implementationAddress,
    storageLayout,
    compilation,
    isStorageFetched,
    deployment,
    setMetadata,
    reset,
  } = useContractMetadata();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"layout" | "raw">("layout");
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const chain = Object.values(chains).find(c => c.id === chainIdFromUrl);
  const blockExplorer = getBlockExplorerAddressLink(chain ?? chains.mainnet, addressFromUrl ?? "");

  const isUnsupportedProxy = isProxy && !implementationAddress;

  // Refresh on param change
  useEffect(() => {
    reset();
  }, [addressFromUrl, chainIdFromUrl, reset]);

  // Fetch metadata if not present or incomplete
  useEffect(() => {
    if (!addressFromUrl || !chainIdFromUrl || !isAddress(addressFromUrl)) {
      notification.error("Invalid address or network");
      router.push("/");
      return;
    }

    const shouldFetch = !isStorageFetched;

    if (shouldFetch) {
      setLoading(true);
      reset();

      fetchContractMetadataFromSourcify(addressFromUrl, chainIdFromUrl)
        .then(metadata => {
          setMetadata({
            isVerified: metadata.isVerified,
            isProxy: metadata.isProxy,
            proxyType: metadata.proxyType,
            implementationAddress: metadata.implementationAddress,
            storageLayout: metadata.storageLayout,
            compilation: metadata.compilation,
            isStorageFetched: true,
            deployment: metadata.deployment,
          });
        })
        .catch(err => {
          if (err instanceof SourcifyApiError) {
            notification.error(err.message);
          } else {
            notification.error("An unexpected error occurred.");
            console.error(err);
          }
          router.push("/");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    addressFromUrl,
    chainIdFromUrl,
    compilation,
    storageLayout,
    isStorageFetched,
    deployment,
    setMetadata,
    reset,
    router,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>Fetching contract metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold">Storage Explorer</h2>
        <div className="flex items-center gap-2 mt-2 text-center">
          <p className="text-2xl font-bold items-center">{compilation?.name ?? ""}</p>
          <div className="flex flex-col font-mono opacity-80 gap-1">
            <Address address={addressFromUrl ?? ""} size="xs" />
            {implementationAddress && (
              <div className="flex gap-2 items-center">
                <Address address={implementationAddress} size="xs" />
                <div className="text-xs">(Implementation contract)</div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {compilation && (
            <>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs opacity-70">Compiler</p>
                <p className="font-medium overflow-x-auto">{compilation.compilerVersion}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs opacity-70">Language</p>
                <p className="font-medium">{compilation.language}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs opacity-70">Full name</p>
                <p className="font-medium overflow-x-auto">{compilation.fullyQualifiedName}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs opacity-70">EVM version</p>
                <p className="font-medium">{compilation.compilerSettings?.evmVersion}</p>
              </div>
            </>
          )}
        </div>
        {deployment && (
          <div className="flex flex-col gap-2 mt-5">
            <div className="flex flex-wrap items-center text-xs gap-1">
              🚀 Deployed by
              <Address address={deployment.deployer ?? ""} size="xs" />
              at block 📦
              <Link href={blockExplorer} className="link w-1/3 text-base-content no-underline" target="_blank">
                {deployment.blockNumber}
              </Link>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-5">
          {!isUnsupportedProxy && (
            <div className={`badge ${isVerified ? "badge-success" : "badge-warning"}`}>
              {isVerified ? "Verified" : "Unverified"}
            </div>
          )}
          {isProxy && <span className="badge badge-soft">{proxyType ? proxyType : "Proxy"}</span>}
          {storageLayout?.storage && <span className="badge badge-primary">Layout Available</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "layout" ? "tab-active !bg-base-100/50 !text-primary-content" : ""} rounded-xl`}
          onClick={() => setActiveTab("layout")}
        >
          Storage Layout
        </button>
        {isVerified && storageLayout?.storage && (
          <button
            className={`tab ${activeTab === "raw" ? "tab-active !bg-base-100/50 !text-primary-content" : ""} rounded-xl`}
            onClick={() => setActiveTab("raw")}
          >
            Inspect Slots
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="bg-base-100/50 rounded-xl border border-base-300 p-6">
        {activeTab === "layout" && (
          <div>
            {isVerified && storageLayout?.storage && !isUnsupportedProxy ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Storage Variables ({storageLayout.storage.length})</h3>
                </div>
                <div className="space-y-4">
                  {storageLayout.storage.map((item: StorageItem, index: number) => (
                    <StorageSlotRow
                      key={index}
                      item={item}
                      contractAddress={addressFromUrl ?? ""}
                      chainId={chainIdFromUrl ?? 1}
                      storageType={storageLayout.types[item.type]?.label}
                      numberOfBytes={storageLayout.types[item.type]?.numberOfBytes}
                      encoding={storageLayout.types[item.type]?.encoding}
                      mappingKeyType={storageLayout.types[item.type]?.key}
                      dynArrType={storageLayout.types[item.type]?.base}
                      onExplore={payload => {
                        setSelectedSlot(payload);
                        setActiveTab("raw");
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // unverified or no storage layout
              <div className="text-center py-8">
                <div className="text-warning text-5xl mb-4">{isUnsupportedProxy ? "🐌" : isVerified ? "⛱️" : "⚠️"}</div>
                <h3 className="text-xl font-semibold mb-2">
                  {isUnsupportedProxy
                    ? "Unsupported Proxy"
                    : isVerified
                      ? "Storage Layout Not Available"
                      : "Contract Not Verified"}
                </h3>
                <p className="mb-6 max-w-md mx-auto">
                  {isUnsupportedProxy
                    ? "We currently don't support this type of proxy. Please use raw explorer for now! (As storage lies in proxy contract)"
                    : isVerified
                      ? "This contract was verified without storage layout metadata. Use the explorers below to manually inspect storage."
                      : "This contract was not verified on Sourcify. Use the explorers below to manually inspect storage."}
                </p>

                <div className="flex flex-col items-center justify-center mt-8 gap-8">
                  <NormalSlotExplorer chainId={chainIdFromUrl ?? 1} address={addressFromUrl ?? ""} />
                  <hr className="w-full border-gray-400/20 border-1" />
                  <MappingExplorer chainId={chainIdFromUrl ?? 1} address={addressFromUrl ?? ""} />
                  <hr className="w-full border-gray-400/20 border-1" />
                  <DynamicArrayExplorer chainId={chainIdFromUrl ?? 1} address={addressFromUrl ?? ""} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "raw" && (
          <div>
            {!selectedSlot ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-4">🐛</div>
                <p className="mb-4 opacity-90">Select a storage slot from the layout to inspect it.</p>
              </div>
            ) : (
              <>
                <div className="card bg-base-200 border border-base-300 rounded-xl shadow-sm">
                  <div className="card-body space-y-3 break-all whitespace-pre-wrap">
                    <h3 className="card-title text-lg font-semibold">Slot #{selectedSlot.index}</h3>
                    <div>
                      <span className="text-sm opacity-70">Slot:</span>
                      <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                        0x{selectedSlot.index.toString(16).padStart(64, "0")}
                      </div>
                    </div>
                    {selectedSlot.offset !== 0 && (
                      <div>
                        <span className="text-sm opacity-70">Offset:</span>
                        <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                          {selectedSlot.offset}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm opacity-70">Variable:</span>
                      <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                        {selectedSlot.label}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm opacity-70">Type:</span>
                      <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                        {selectedSlot.type}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm opacity-70">Size:</span>
                      <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                        {selectedSlot.numberOfBytes} byte(s)
                      </div>
                    </div>
                    {selectedSlot.value && (
                      <div>
                        <span className="text-sm opacity-70">Value:</span>
                        <div className="font-mono bg-base-300/40 px-2 py-1 rounded-lg ml-2 inline-block">
                          {renderHighlightedValue(selectedSlot.value, selectedSlot.offset, selectedSlot.numberOfBytes)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {selectedSlot.encoding === "mapping" && (
                  <div className="flex flex-col items-center justify-center mt-8">
                    <MappingExplorer
                      chainId={chainIdFromUrl ?? 1}
                      address={addressFromUrl ?? ""}
                      mappingSlot={selectedSlot.slot}
                      mappingKeyType={selectedSlot.mappingKeyType}
                    />
                  </div>
                )}
                {selectedSlot.encoding === "dynamic_array" && (
                  <div className="flex flex-col items-center justify-center mt-8">
                    <DynamicArrayExplorer
                      chainId={chainIdFromUrl ?? 1}
                      address={addressFromUrl ?? ""}
                      baseSlot={selectedSlot.slot}
                      dynArrType={selectedSlot.dynArrType}
                      arrLength={selectedSlot.value ?? ""}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
