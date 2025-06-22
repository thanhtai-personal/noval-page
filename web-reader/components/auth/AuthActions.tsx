"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@heroui/button";

import { LinkWithRedirecting } from "../common/utils/LinkWithRedirecting";

import { appStore } from "@/store/AppStore.store";
import { ProfileIcon } from "@/components/default/icons";
import { AnimationLogoutButton } from "@/components/animations/logoutBtn/AnimationLogoutButton";
import { useTranslations } from "next-intl";

export const AuthActions = observer(() => {
  const t = useTranslations('nav');

  return (
    <div className="flex gap-2 items-center">
      <LinkWithRedirecting href="/profile">
        <Button size="md" variant="flat">
          <ProfileIcon className="size-6 text-default-500" />
        </Button>
      </LinkWithRedirecting>
      {appStore.isLoggedIn ? (
        <AnimationLogoutButton
          onLogout={() => appStore.logout()}
          label={t('logout')}
          className="animation-button-red-appear"
        />
      ) : (
        <LinkWithRedirecting href="/login" className="animation-button-green-appear">
          <AnimationLogoutButton label={t('login')} />
        </LinkWithRedirecting>
      )}
    </div>
  );
});
