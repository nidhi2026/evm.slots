import { useEffect, useState } from "react";
import { Address, Hex, encodeAbiParameters, hexToBigInt, isHex, keccak256, numberToHex, toHex } from "viem";
import { getPublicClient } from "~~/hooks/usePublicClient";

class InvalidSlotFormatError extends Error {
  constructor(input: string) {
    super(`Invalid slot format: "${input}"`);
    this.name = "InvalidSlotFormatError";
  }
}

const formatSlot = (input: string): Hex => {
  if (isHex(input)) {
    return toHex(hexToBigInt(input)); // accept hex "0x00a" as "0xa"
  }
  if (/^\d+$/.test(input)) {
    return toHex(BigInt(input)); // accept decimal "10" as "0xa"
  }
  throw new InvalidSlotFormatError(input);
};

/*
Slot Explorer
*/
type NormalSlotExplorerProps = {
  chainId: number;
  address: Address;
};

export const NormalSlotExplorer = ({ chainId, address }: NormalSlotExplorerProps) => {
  const [slot, setSlot] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicClient = getPublicClient(chainId);

  const fetchSlotValue = async (): Promise<Hex | null> => {
    if (!address || !publicClient) return null;
    setLoading(true);
    setError(null);
    setValue(null);
    try {
      const storageValue = await publicClient.getStorageAt({
        address: address,
        slot: formatSlot(slot),
      });
      setValue(storageValue || "0x0");
      return storageValue || "0x0";
    } catch (err) {
      if (err instanceof InvalidSlotFormatError) {
        setError("Invalid slot (use hex like 0x0... or decimal like 0)");
      } else {
        setError("Unable to fetch value, retry later");
      }
      setValue(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl p-5 border border-base-300 shadow-md w-full max-w-md">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold opacity-80">Slot Explorer</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input input-bordered py-1 flex-1 min-w-0 sm:w-auto w-full"
            placeholder="Slot (e.g. 0x0 or 0)"
            value={slot}
            onChange={e => setSlot(e.target.value)}
          />
          <button
            className="btn btn-primary btn-m sm:w-auto w-full"
            disabled={!slot || loading}
            onClick={fetchSlotValue}
          >
            {loading ? <div className="loading loading-spinner loading-xs"></div> : "Fetch"}
          </button>
        </div>
        {value && (
          <div className="font-mono text-sm bg-base-300/40 px-3 py-2 rounded-lg break-all whitespace-pre-wrap">
            {value}
          </div>
        )}
        {error && <div className="text-error text-xs bg-error/10 px-2 py-1 rounded-md">{error}</div>}
      </div>
    </div>
  );
};

/*
Mapping Slot Explorer
*/
const formatStorageType = (type: string): string => {
  if (type === "t_address") return "address";
  if (type === "t_bool") return "bool";
  if (type === "t_string") return "string";

  if (type.startsWith("t_uint")) return "uint256";
  if (type.startsWith("t_int")) return "int256";

  return "bytes32";
};

const STORAGE_TYPES = ["t_address", "t_bool", "t_uint256", "t_int256", "t_bytes32", "t_string"] as const;
type StorageType = (typeof STORAGE_TYPES)[number];

const isStorageType = (value: string): value is StorageType => {
  return STORAGE_TYPES.includes(value as StorageType);
};

type MappingExplorerProps = {
  chainId: number;
  address: Address;
  mappingSlot?: string;
  mappingKeyType?: string;
};

export const MappingExplorer = ({ chainId, address, mappingSlot, mappingKeyType }: MappingExplorerProps) => {
  const [slot, setSlot] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [keyType, setKeyType] = useState<StorageType | null>(null);
  const [isInvalidKeyType, setIsInvalidKeyType] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicClient = getPublicClient(chainId);

  useEffect(() => {
    if (mappingSlot) {
      setSlot(mappingSlot);
    }
    if (mappingKeyType) {
      if (isStorageType(mappingKeyType)) {
        setKeyType(mappingKeyType);
      } else {
        setIsInvalidKeyType(true);
      }
    }
  }, [mappingSlot, mappingKeyType]);

  const deriveMappingSlot = (baseSlot: Hex, abiKeyType: string): Hex => {
    return keccak256(encodeAbiParameters([{ type: abiKeyType }, { type: "uint256" }], [key, hexToBigInt(baseSlot)]));
  };

  const fetchSlotValue = async (): Promise<Hex | null> => {
    if (!address || !publicClient) return null;
    setLoading(true);
    setError(null);
    setValue(null);
    try {
      const storageValue = await publicClient.getStorageAt({
        address: address,
        slot: deriveMappingSlot(formatSlot(slot), formatStorageType(keyType ?? "")),
      });
      setValue(storageValue || "0x0");
      return storageValue || "0x0";
    } catch (err) {
      if (err instanceof InvalidSlotFormatError) {
        setError("Invalid slot (use hex like 0x0... or decimal like 0)");
      } else {
        setError("Unable to fetch value");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl p-5 border border-base-300 shadow-md w-full max-w-md">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold opacity-80">Mapping Slot Explorer</div>
        <div className="flex flex-col gap-3">
          {!mappingSlot && (
            <input
              className="input input-bordered w-full"
              placeholder="Mapping base slot (e.g. 0x3 or 3)"
              value={slot}
              onChange={e => setSlot(e.target.value)}
            />
          )}
          <input
            className="input input-bordered w-full"
            placeholder={`Key ${isStorageType(keyType ?? "") && keyType ? ` (${formatStorageType(keyType)})` : ""}`}
            value={key}
            onChange={e => setKey(e.target.value)}
          />
          {(!mappingKeyType || isInvalidKeyType) && (
            <select
              className="select select-bordered w-full"
              value={keyType ?? ""}
              onChange={e => {
                const value = e.target.value;
                if (isStorageType(value)) {
                  setKeyType(value);
                }
              }}
            >
              <option value="" disabled>
                Select key type
              </option>
              {STORAGE_TYPES.map(type => (
                <option key={type} value={type}>
                  {formatStorageType(type)}
                </option>
              ))}
            </select>
          )}
          <button
            className="btn btn-primary btn-m sm:w-auto w-full"
            disabled={!slot || !key || !keyType || loading}
            onClick={fetchSlotValue}
          >
            {loading ? <div className="loading loading-spinner loading-xs"></div> : "Fetch"}
          </button>
        </div>
        {value && (
          <div className="font-mono text-sm bg-base-300/40 px-3 py-2 rounded-lg break-all whitespace-pre-wrap">
            {value}
          </div>
        )}
        {error && <div className="text-error text-xs bg-error/10 px-2 py-1 rounded-md">{error}</div>}
        {isInvalidKeyType && (
          <div className="text-neutral text-xs bg-warning/40 px-2 py-1 rounded-md">
            We couldn&apos;t infer the key type = {mappingKeyType}, select one
          </div>
        )}
      </div>
    </div>
  );
};

/*
Dyanamic Array Slot Explorer
*/
type DynamicArrayExplorerProps = {
  chainId: number;
  address: Address;
  baseSlot?: string;
  dynArrType?: string;
  arrLength?: string;
};

export const DynamicArrayExplorer = ({
  chainId,
  address,
  baseSlot,
  dynArrType,
  arrLength,
}: DynamicArrayExplorerProps) => {
  const [slot, setSlot] = useState<string>("");
  const [index, setIndex] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lenOfArr, setLenOfArr] = useState<bigint | null>(null);

  const publicClient = getPublicClient(chainId);

  useEffect(() => {
    if (arrLength) {
      setLenOfArr(BigInt(arrLength));
    }
    if (baseSlot) {
      setSlot(baseSlot);
    }
  }, [arrLength, baseSlot]);

  // Curently for 1n types only (1 slot per element)
  // keccak256(baseSlot) + index
  const deriveArraySlot = (baseSlot: Hex, index: bigint): Hex => {
    const base = BigInt(keccak256(encodeAbiParameters([{ type: "uint256" }], [hexToBigInt(baseSlot)])));
    return numberToHex(base + index, { size: 32 });
  };

  const isValidArrayIndex = (value: string): boolean => /^\d+$/.test(value);

  const fetchSlotValue = async (): Promise<Hex | null> => {
    if (!address || !publicClient) return null;

    setError(null);
    setValue(null);
    setLoading(true);

    if (!isValidArrayIndex(index)) {
      setError("Index must be a non-negative integer");
      return null;
    }

    try {
      if (lenOfArr === null && slot) {
        const rawLength = await publicClient.getStorageAt({
          address,
          slot: formatSlot(slot),
        });
        if (rawLength) setLenOfArr(BigInt(rawLength));
      }

      const storageValue = await publicClient.getStorageAt({
        address: address,
        slot: deriveArraySlot(formatSlot(slot), BigInt(index)),
      });
      setValue(storageValue || "0x0");
      return storageValue || "0x0";
    } catch (err) {
      if (err instanceof InvalidSlotFormatError) {
        setError("Invalid slot (use hex like 0x0... or decimal like 0)");
      } else {
        setError("Unable to fetch value");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl p-5 border border-base-300 shadow-md w-full max-w-md">
      <div className="flex flex-col gap-3">
        <div className="text-sm font-semibold opacity-80">Dynamic Array Slot Explorer</div>
        <div className="flex flex-col gap-3">
          {!baseSlot && (
            <input
              className="input input-bordered w-full"
              placeholder="Array base slot (e.g. 0x3 or 3)"
              value={slot}
              onChange={e => setSlot(e.target.value)}
            />
          )}
          <input
            className="input input-bordered w-full"
            placeholder={`Index ${lenOfArr && lenOfArr > 1 ? `(0 to ${lenOfArr - 1n})` : ""}`}
            value={index}
            onChange={e => setIndex(e.target.value)}
          />
          <button
            className="btn btn-primary btn-m sm:w-auto w-full"
            disabled={!slot || !index || loading}
            onClick={fetchSlotValue}
          >
            {loading ? <div className="loading loading-spinner loading-xs"></div> : "Fetch"}
          </button>
        </div>
        {value && (
          <div className="font-mono text-sm bg-base-300/40 px-3 py-2 rounded-lg break-all whitespace-pre-wrap">
            {value}
          </div>
        )}
        {error && <div className="text-error text-xs bg-error/10 px-2 py-1 rounded-md">{error}</div>}
        {dynArrType && !["t_uint256", "t_int256", "t_bytes32", "t_address", "t_bool"].includes(dynArrType) && (
          <div className="text-warning text-xs bg-warning/20 px-2 py-1 rounded-md">
            Currently not supporting this type ({dynArrType}). Showing full 32-byte slot. Decoding/padding may require
            ABI information.
          </div>
        )}
      </div>
    </div>
  );
};
