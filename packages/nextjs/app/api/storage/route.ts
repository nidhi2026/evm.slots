import { getPublicClient } from "~~/hooks/usePublicClient";

export async function POST(req: Request) {
  const { address, slot, chainId } = await req.json();
  const client = getPublicClient(chainId);

  const storageValue = await client.getStorageAt({
    address,
    slot,
  });

  return Response.json({ storageValue });
}
