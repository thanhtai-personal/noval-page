import { makeAutoObservable } from 'mobx';

export class AppStore {
  useLayout: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setConfig(useLayout?: boolean) {
    this.useLayout = useLayout || false;
  }

  clear() {
    this.useLayout = true;
  }
}

export const appStore = new AppStore();
