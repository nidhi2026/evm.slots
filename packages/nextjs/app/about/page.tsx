import Link from "next/link";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";

export default function About() {
  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-8">
        {/* Intro */}
        <section className="bg-base-300/60 rounded-xl border border-base-300 p-6 text-md">
          <h3 className="text-3xl font-bold">Welcome to evm.slots!</h3>
          <p className="mb-2">
            A storage explorer for smart contracts on EVM chains. Peek into your contract&apos;s variables.
          </p>
          <p className="mb-2">
            💡 Inspect contract storage across multiple EVM chains and fetch on-chain values from RPC.
          </p>
          <p>
            Why do we need a slot explorer? Well, not everything is exposed by the ABI. Slot explorers let you read
            internal state variables that are not accessible via contract methods.
          </p>
        </section>

        {/* Why EVM.SLOTS */}
        <section className="bg-base-300/60 rounded-xl border border-base-300 p-6 text-md">
          <p className="font-semibold text-lg mb-4">Other storage explorers exist — so why EVM.SLOTS?</p>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-md">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>
                    <a href="https://evm-storage.codes/" className="link" target="_blank">
                      EVM-Storage.codes
                    </a>
                  </th>
                  <th>
                    <a href="https://evmole.xyz/" className="link" target="_blank">
                      EVMole
                    </a>
                  </th>
                  <th>EVM.SLOTS (Ours)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>All EVM chains support</td>
                  <td>✅ (name-based search only)</td>
                  <td>❌ (limited)</td>
                  <td>✅ + add custom chains</td>
                </tr>
                <tr>
                  <td>Fetch on-chain slot values</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Variable name</td>
                  <td>✅</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Type, Slot & offset info</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Mapping slot explorer</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Dynamic array explorer</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅</td>
                </tr>
                <tr>
                  <td>Proxy storage support</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅ (transparent proxy)</td>
                </tr>
                <tr>
                  <td>Unverified contract support</td>
                  <td>❌</td>
                  <td>✅ (by decoded bytecode only)</td>
                  <td>✅ (raw slots)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Sourcify */}
            <div className="bg-base-300/60 p-4 rounded-lg">
              <p className="text-xs opacity-70 mb-1">Sourcify API</p>

              <p className="font-medium mb-3">Fetches verified contract metadata.</p>

              <p className="text-sm opacity-80 mb-4">storage layout, compilation, and deployment metadata.</p>

              <code className="text-xs opacity-80 break-words block">
                https://sourcify.dev/server/v2/contract/&lt;chain&gt;/&lt;address&gt;?fields=all
              </code>
            </div>

            {/* getStorageAt */}
            <div className="bg-base-300/60 p-4 rounded-lg">
              <p className="text-xs opacity-70 mb-1">Raw Slot Reading</p>

              <p className="font-medium mb-3">
                Reads storage from the EVM using the JSON-RPC method
                <code className="text-sm opacity-80"> getStorageAt(address, slot)</code>
              </p>

              <p className="text-sm opacity-80">
                Inspect internal states, even for unverified contracts, by querying the value stored at a slot.
              </p>
            </div>

            {/* Mapping */}
            <div className="bg-base-300/60 p-4 rounded-lg">
              <p className="text-xs opacity-70 mb-1">Mapping Slots</p>

              <p className="font-medium mb-3">
                Each key is hashed together with the base slot to derive its storage location.
              </p>

              <code className="text-xs opacity-80 block">slot = keccak256(key . slot)</code>
            </div>

            {/* Arrays */}
            <div className="bg-base-300/60 p-4 rounded-lg">
              <p className="text-xs opacity-70 mb-1">Array Slots</p>

              <p className="font-medium mb-3">
                Dynamic arrays store their length at the base slot, while elements are stored contiguously starting from
                a hashed location.
              </p>

              <code className="text-xs opacity-80 block">slot = keccak256(slot) + index x elementSize</code>
            </div>
          </div>
        </section>

        <section className="bg-base-300/60 rounded-xl border border-base-300 text-center p-6 text-lg">
          <p className="mb-4">Are you ready to get an insider view of a contract&apos;s storage?</p>
          <Link href="/" className="btn btn-info text-base-content">
            Explore
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
