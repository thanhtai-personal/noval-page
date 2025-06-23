"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

import { LinkWithRedirecting } from "@/components/common/utils/LinkWithRedirecting";

import { appStore } from "@/store/AppStore.store";
import { AnimationLogoutButton } from "@/components/animations/logoutBtn/AnimationLogoutButton";
import { useTranslations } from "next-intl";
import { useEaseInOutAnimationButton } from "@/hooks/useEaseInOutAnimationButton";
import { ProfileIcon } from "@/components/default/icons";
// import ProfileButton from "@/components/common/ProfileButton/ProfileButton";

export const AuthActions = observer(() => {
  const t = useTranslations("nav");

  const [commonClass, showButton] = useEaseInOutAnimationButton(
    appStore.isLoggedIn,
  );

  return (
    <div className="flex gap-2 items-center">
      <LinkWithRedirecting href="/profile">
        <ProfileIcon className="size-6 text-default-500" />
        {/* <ProfileButton onClick={() => alert("Clicked!")} /> */}
      </LinkWithRedirecting>

      {showButton ? (
        <AnimationLogoutButton
          onLogout={() => appStore.logout()}
          label={t("logout")}
          className={`${commonClass} logout-btn bg-red-500`}
        />
      ) : (
        <LinkWithRedirecting
          href="/login"
          className={`${commonClass} login-btn bg-green-800`}
        >
          <AnimationLogoutButton label={t("login")} />
        </LinkWithRedirecting>
      )}
    </div>
  );
});
