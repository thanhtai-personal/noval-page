"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@heroui/button";

import { LinkWithRedirecting } from "../common/utils/LinkWithRedirecting";

import { appStore } from "@/store/AppStore.store";
import { ProfileIcon, LogoutIcon } from "@/components/default/icons";

export const AuthActions = observer(() => {
  return (
    <div className="flex gap-2 items-center">
      <LinkWithRedirecting href="/profile">
        <Button size="sm" variant="flat">
          <ProfileIcon className="size-5 text-default-500" />
        </Button>
      </LinkWithRedirecting>
      {appStore.isLoggedIn ? (
        <Button color="danger" size="sm" onClick={() => appStore.logout()}>
          <LogoutIcon className="size-5 text-default-500" />
        </Button>
      ) : (
        <LinkWithRedirecting href="/login">
          <Button color="primary" size="sm">
            Login
          </Button>
        </LinkWithRedirecting>
      )}
    </div>
  );
});
