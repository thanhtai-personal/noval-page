"use client";

import { observer } from "mobx-react-lite";
import { appStore } from "@/store/AppStore.store";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ProfileIcon, LogoutIcon } from "@/components/icons";

export const AuthActions = observer(() => {
  return (
    <div className="flex gap-2 items-center">
      <Link href="/profile">
        <Button size="sm" variant="flat">
          <ProfileIcon className="size-5 text-default-500" />
        </Button>
      </Link>
      {appStore.isLoggedIn ? (
        <Button size="sm" color="danger" onClick={() => appStore.logout()}>
          <LogoutIcon className="size-5 text-default-500" />
        </Button>
      ) : (
        <Link href="/login">
          <Button size="sm" color="primary">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
});
