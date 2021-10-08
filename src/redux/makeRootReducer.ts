import { combineReducers } from "redux";
import account from "./slices/accountSlice";
import appConfig from "./slices/appConfigSlice";
import economics from "./slices/economicsSlice";
import modals from "./slices/modalsSlice";
import multisigContracts from "./slices/multisigContractsSlice";
import toasts from "./slices/toastsSlice";
import signTransactions from "./slices/transactionsSlice";

export default function makeRootReducer() {
  return combineReducers({
    multisigContracts,
    signTransactions,
    toasts,
    modals,
    economics,
    account,
    appConfig,
  });
}
