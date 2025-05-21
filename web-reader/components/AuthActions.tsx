"use client";

import { observer } from "mobx-react-lite";
import { appStore } from "@/store/AppStore.store";
import { Button } from "@heroui/button";
import { ProfileIcon, LogoutIcon } from "@/components/icons";
import { LinkWithRedirecting } from "./LinkWithRedirecting";

export const AuthActions = observer(() => {
  return (
    <div className="flex gap-2 items-center">
      <LinkWithRedirecting href="/profile">
        <Button size="sm" variant="flat">
          <ProfileIcon className="size-5 text-default-500" />
        </Button>
      </LinkWithRedirecting>
      {appStore.isLoggedIn ? (
        <Button size="sm" color="danger" onClick={() => appStore.logout()}>
          <LogoutIcon className="size-5 text-default-500" />
        </Button>
      ) : (
        <LinkWithRedirecting href="/login">
          <Button size="sm" color="primary">
            Login
          </Button>
        </LinkWithRedirecting>
      )}
    </div>
  );
});
