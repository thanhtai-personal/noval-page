import { ReactNode, createContext, useContext } from "react";

import { appStore, AppStore } from "./AppStore";

const StoreContext = createContext<AppStore>(appStore);

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={appStore}>{children}</StoreContext.Provider>
  );
}

export const useAppStore = () => useContext(StoreContext);
