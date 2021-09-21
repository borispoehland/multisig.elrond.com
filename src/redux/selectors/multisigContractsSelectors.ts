import { Address } from "@elrondnetwork/erdjs/out";
import { RootState } from "../store";
import { createDeepEqualSelector } from "./helpers";

const mainSelector = (state: RootState) => state.multisigContracts;

export const multisigContractsLoadingSelector = createDeepEqualSelector(
  mainSelector,
  (state) => state.loading,
);

export const multisigContractsSelector = createDeepEqualSelector(
  mainSelector,
  (state) => {
    return state.multisigContracts.map((contract) => ({
      ...contract,
      address: new Address(contract.address.hex),
    }));
  },
);

export const currentMultisigAddressSelector = createDeepEqualSelector(
  mainSelector,
  (state) => {
    const address = state.currentMultisigAddress;
    if (address != null) {
      return new Address(address.hex);
    }
    return undefined;
  },
);