import { makeAutoObservable } from "mobx";
import Cookies from "js-cookie";
import { setToken } from "@/utils/api";

export class AppStore {
  useLayout: boolean = true;
  token: string | null = null;
  profile: any = null;

  constructor() {
    makeAutoObservable(this);
    this.token = Cookies.get("token") || null;
  }

  setConfig(useLayout?: boolean) {
    this.useLayout = useLayout || false;
  }

  setToken(token: string) {
    this.token = token;
    setToken(token);
    Cookies.set("token", token, {
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
  }

  setProfile(profile: any) {
    this.profile = profile;
  }

  logout() {
    this.token = null;
    this.profile = null;
    setToken("");
    Cookies.remove("token", { path: "/" });
  }

  get isLoggedIn() {
    return !!this.token && !!this.profile;
  }

  clear() {
    this.useLayout = true;
    this.logout();
  }
}

export const appStore = new AppStore();
