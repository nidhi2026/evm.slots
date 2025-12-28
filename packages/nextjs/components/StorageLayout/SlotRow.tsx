import { useState } from "react";
import { renderHighlightedValue } from "./StorageValueRenderer";
import { Address, toHex } from "viem";
import { getPublicClient } from "~~/hooks/usePublicClient";

interface ExplorePayload {
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
}

export interface StorageItem {
  slot: string;
  type: string;
  astId: number;
  label: string;
  offset: number;
  contract: string;
}

interface StorageSlotRowProps {
  item: StorageItem;
  contractAddress: Address;
  chainId: number;
  storageType: string;
  numberOfBytes: number;
  encoding: string;
  mappingKeyType: string;
  dynArrType: string;
  onExplore: (payload: ExplorePayload) => void;
}

export default function StorageSlotRow({
  item,
  contractAddress,
  chainId,
  storageType,
  numberOfBytes,
  encoding,
  mappingKeyType,
  dynArrType,
  onExplore,
}: StorageSlotRowProps) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const publicClient = getPublicClient(chainId);

  const fetchSlotValue = async (): Promise<string | null> => {
    if (!contractAddress || !publicClient) return null;

    setLoading(true);
    try {
      const slotIndex = parseInt(item.slot);
      const slotHex = toHex(slotIndex);

      const storageValue = await publicClient.getStorageAt({
        address: contractAddress,
        slot: slotHex as `0x${string}`,
      });

      setValue(storageValue || "0x0");
      return storageValue || "0x0";
    } catch (error) {
      console.error("Failed to fetch storage value:", error);
      setValue("Error fetching value");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formattedSlotIndex = `${parseInt(item.slot).toString(16).toUpperCase()}`;

  const formatType = (type: string): string => {
    return type.replace(/=\\u003E/g, "=>");
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 border border-base-300 overflow-x-auto">
      <div className="flex items-start justify-between">
        {/* Left: Slot and variable details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 p-1">
            <div className="badge badge-primary font-mono text-xs gap-0">
              Slot: <span className="opacity-30 ml-2">0x{"".padStart(64 - item.slot.length, "0")}</span>{" "}
              {formattedSlotIndex}
            </div>
            {item.offset > 0 && <div className="badge badge-outline text-xs">Offset: {item.offset}</div>}
          </div>

          <div className="space-y-2">
            <div>
              <div className="font-mono text-base font-semibold mt-1">{item.label}</div>
            </div>

            <div>
              <span className="text-sm opacity-70">Type:</span>
              <div className="font-mono text-sm bg-base-300/40 px-2 py-1 rounded-lg mt-1 ml-2 inline-block">
                {formatType(storageType)}
              </div>
            </div>

            {value && (
              <div>
                <span className="text-sm opacity-70">Value:</span>
                <div className="font-mono text-sm bg-base-300/40 px-2 py-1 rounded-lg mt-1 ml-2 inline-block">
                  {renderHighlightedValue(value, item.offset, numberOfBytes)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Value and refresh button */}
        <div className="flex flex-col items-center lg:items-end gap-5">
          <button onClick={fetchSlotValue} disabled={loading} className="btn btn-primary btn-sm w-fit">
            {loading ? (
              <div className="loading loading-spinner loading-xs mr-2"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </button>
          <button
            onClick={async () => {
              const fetchedValue = await fetchSlotValue();
              onExplore({
                slot: item.slot,
                index: parseInt(item.slot),
                type: formatType(storageType),
                value: fetchedValue,
                offset: item.offset,
                numberOfBytes: numberOfBytes,
                encoding: encoding,
                label: item.label,
                mappingKeyType: mappingKeyType,
                dynArrType: dynArrType,
              });
            }}
            disabled={loading || !publicClient}
            className="btn btn-ghost btn-sm"
            title="Inspect this slot"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
