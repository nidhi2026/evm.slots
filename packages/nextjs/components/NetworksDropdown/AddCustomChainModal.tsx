import { forwardRef } from "react";
import {
  GroupedOptions,
  chainToOption,
  formDataToChain,
  getStoredChainsFromLocalStorage,
  storeChainInLocalStorage,
} from "./utils";
import { Options } from "./utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

type AddCustomChainModalProps = {
  groupedOptionsState: GroupedOptions;
  setGroupedOptionsState: React.Dispatch<React.SetStateAction<GroupedOptions>>;
  setSelectedOption: React.Dispatch<React.SetStateAction<Options | null>>;
  onChange: (option: Options | null) => void;
};

export const AddCustomChainModal = forwardRef<HTMLDialogElement, AddCustomChainModalProps>(
  ({ groupedOptionsState, setGroupedOptionsState, setSelectedOption, onChange }, ref) => {
    const addCustomChain = useGlobalState(state => state.addChain);
    const setTargetNetwork = useGlobalState(state => state.setTargetNetwork);

    const handleSubmitCustomChain = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const chain = formDataToChain(formData);

      const storedChains = getStoredChainsFromLocalStorage();

      if (storedChains.find(c => c.id === chain.id)) {
        handleCloseModal();
        e.currentTarget.reset();
        notification.error("This chain is already added!");
        return;
      }

      storeChainInLocalStorage(chain);
      addCustomChain(chain);

      const newGroupedOptions = { ...groupedOptionsState };
      const groupName = chain.testnet ? "testnet" : "mainnet";
      const newOption = chainToOption(chain);
      newGroupedOptions[groupName].options.push(newOption);

      setGroupedOptionsState(newGroupedOptions);

      e.currentTarget.reset();

      setSelectedOption(newOption);
      setTargetNetwork(chain);
      onChange(newOption);

      handleCloseModal();
    };

    const handleCloseModal = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    };

    return (
      <dialog id="add-custom-chain-modal" className="modal" ref={ref}>
        <form method="dialog" className="modal-box p-12 bg-base-100 text-left" onSubmit={handleSubmitCustomChain}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">Add Custom Chain</h3>
            <div className="modal-action mt-0">
              <button className="hover:text-error" type="button" onClick={handleCloseModal}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text pl-1">Chain ID</span>
            </label>
            <input
              type="number"
              name="id"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text pl-1">Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text pl-1">Native Currency Name</span>
            </label>
            <input
              type="text"
              name="nativeCurrencyName"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text pl-1">Native Currency Symbol</span>
            </label>
            <input
              type="text"
              name="nativeCurrencySymbol"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text pl-1">Native Currency Decimals</span>
            </label>
            <input
              type="number"
              name="nativeCurrencyDecimals"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex-col">
            <label className="label">
              <span className="label-text pl-1">RPC URL</span>
            </label>
            <input
              type="text"
              name="rpcUrl"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
              required
            />
          </div>
          <div className="form-control flex-col">
            <label className="label">
              <span className="label-text pl-1">Block explorer link (optional)</span>
            </label>
            <input
              type="text"
              name="blockExplorer"
              className="input input-bordered w-full mb-3 rounded-xl bg-secondary/40 focus:outline-none"
            />
          </div>
          <div className="form-control mt-4">
            <label className="label cursor-pointer gap-6">
              <span className="label-text pl-1">Testnet?</span>
              <input type="checkbox" className="checkbox checkbox-secondary" />
            </label>
          </div>
          <div className="modal-action mt-6">
            <button type="submit" className="btn btn-primary">
              Add Chain
            </button>
          </div>
        </form>
      </dialog>
    );
  },
);

AddCustomChainModal.displayName = "AddCustomChainModal";
