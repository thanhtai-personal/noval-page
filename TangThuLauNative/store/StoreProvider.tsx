import React, { ReactNode, useContext } from 'react';
import { Provider, MobXProviderContext } from 'mobx-react-lite';
import { appStore } from './AppStore';

export const StoreProvider = ({ children }: { children: ReactNode }) => (
  <Provider appStore={appStore}>{children}</Provider>
);

export type { AppStore } from './AppStore';

export const useAppStore = () => {
  const { appStore: store } = useContext(MobXProviderContext) as any;
  return store as typeof appStore;
};
