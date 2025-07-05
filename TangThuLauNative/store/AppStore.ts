import { makeAutoObservable } from 'mobx';

export class AppStore {
  loggedIn = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }
}

export const appStore = new AppStore();
export type AppStoreType = AppStore;
