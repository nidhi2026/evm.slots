"use client";

import { useState } from "react";
import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Address, AddressInput } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import { Footer } from "~~/components/Footer";
import { NetworksDropdown } from "~~/components/NetworksDropdown/NetworksDropdown";
import { useContractMetadata } from "~~/services/store/metadata";
import { notification } from "~~/utils/scaffold-eth";
import { SourcifyApiError, fetchContractMetadataFromSourcify } from "~~/utils/sourcify/api";

const Home: NextPage = () => {
  const [network, setNetwork] = useState(mainnet.id.toString());
  const [contractAddress, setContractAddress] = useState("");
  const [isContractVerified, setIsContractVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineMessage, setInlineMessage] = useState<string | null>(null);
  const [implementationAddress, setImplementationAddress] = useState("");
  const [isContractProxy, setIsContractProxy] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { setMetadata } = useContractMetadata();

  const router = useRouter();

  const resetDerivedState = () => {
    setIsContractVerified(false);
    setIsContractProxy(false);
    setImplementationAddress("");
    setInlineMessage(null);
    setShowStorage(false);
  };

  const handleFetch = async () => {
    if (!isAddress(contractAddress)) {
      notification.error("Not a valid addresss");
      return;
    }
    setIsContractVerified(false);
    setIsContractProxy(false);
    setInlineMessage(null);
    setShowStorage(false);
    setLoading(true);

    try {
      const metadata = await fetchContractMetadataFromSourcify(contractAddress, Number(network));

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

      setShowStorage(true);
      if (metadata.isProxy) {
        setIsContractProxy(true);
        setImplementationAddress(metadata.implementationAddress ?? "");
      }

      if (metadata.isVerified) {
        setIsContractVerified(true);
        notification.success("Contract Metadata successfully loaded!");
      }

      if (metadata.isProxy && !metadata.implementationAddress) {
        setInlineMessage("This proxy type is not supported yet. You can still inspect raw storage.");
      } else if (!metadata.isVerified) {
        setInlineMessage(
          `The ${metadata.isProxy ? "implementation" : "contract"} is not verified on Sourcify on this network.`,
        );
      }
    } catch (err) {
      if (err instanceof SourcifyApiError) {
        notification.error(err.message);
      } else {
        notification.error("An unexpected error occured.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    startTransition(() => {
      router.push(`/${contractAddress}/${network}`);
    });
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col grow pt-10">
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-col bg-base-300/50 px-10 py-10 text-center items-center max-w-l rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <h1 className="text-center">
              <span className="block text-4xl font-bold">EVM.SLOTS</span>
            </h1>
            <p className="text-center text-lg">Analyze storage layouts of smart contracts on any EVM chain</p>
            <div className="mt-4" id="react-select-container">
              <NetworksDropdown
                onChange={option => {
                  setNetwork(option ? option.value.toString() : "");
                  resetDerivedState();
                }}
              />
            </div>
            <div className="w-10/12 my-8 tektur-font">
              <AddressInput
                placeholder="Contract address (0x...)"
                value={contractAddress}
                onChange={value => {
                  setContractAddress(value);
                  resetDerivedState();
                }}
                style={{
                  fontFamily: "var(--font-stiff), monospace",
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-10">
              <button
                onClick={handleFetch}
                disabled={loading || !contractAddress}
                className="btn btn-secondary min-h-fit h-10 px-4 text-base border-2"
              >
                {loading ? "Fetching..." : "Fetch Storage"}
              </button>
              <button
                onClick={handleNavigate}
                disabled={loading || !showStorage || isPending}
                className={`btn ${isContractVerified ? "btn-success" : "btn-warning"} min-h-fit h-10 px-4 text-base border-2`}
              >
                {isPending ? "Loading..." : <>View {showStorage && !isContractVerified ? "Raw" : ""} Storage</>}
              </button>
            </div>
            {inlineMessage && (
              <div className="flex flex-col mt-6 p-3 max-w-md mx-auto bg-warning/30 text-base-content rounded-lg text-sm items-center gap-2">
                {inlineMessage}
                {implementationAddress && <Address address={implementationAddress} size="xs" />}

                {/* Only show verify link when verification is actually possible */}
                {!isContractProxy || implementationAddress ? (
                  <Link href="https://verify.sourcify.dev/" passHref className="link text-center text-base-content">
                    Verify on Sourcify
                  </Link>
                ) : null}
              </div>
            )}

            <div className="flex flex-col text-sm w-4/5 mb-4 mt-10">
              <div className="mb-2 text-center text-base">Not sure what to look for? Try these...</div>
              <div className="flex justify-center w-full rounded-xl">
                <Link
                  href="/0x000000000004444c5dc75cB358380D2e3dE08A90/1"
                  passHref
                  className="link w-1/3 text-center text-base-content no-underline"
                >
                  Uniswap
                </Link>
                <Link
                  href="/0x6B175474E89094C44Da98b954EedeAC495271d0F/1"
                  passHref
                  className="link w-1/3 text-center text-base-content no-underline"
                >
                  DAI
                </Link>
                <Link
                  href="/0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e/1"
                  passHref
                  className="link w-1/3 text-center text-base-content no-underline"
                >
                  Doodles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
