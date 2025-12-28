import StorageLayoutClient from "./storageLayout";
import { Address, isAddress } from "viem";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";

type PageProps = {
  params: Promise<{
    contractAddress: string;
    network: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { contractAddress, network } = await params;

  const addressFromUrl: Address | null = isAddress(contractAddress) ? (contractAddress as Address) : null;

  const chainIdFromUrl = Number.isNaN(Number(network)) ? null : Number(network);

  return (
    <div>
      <Header />
      <StorageLayoutClient addressFromUrl={addressFromUrl} chainIdFromUrl={chainIdFromUrl} />
      <Footer />
    </div>
  );
}
