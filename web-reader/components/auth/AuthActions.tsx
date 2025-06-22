"use client";

import { observer } from "mobx-react-lite";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

import { LinkWithRedirecting } from "../common/utils/LinkWithRedirecting";

import { appStore } from "@/store/AppStore.store";
import { ProfileIcon } from "@/components/default/icons";
import { AnimationLogoutButton } from "@/components/animations/logoutBtn/AnimationLogoutButton";
import { useTranslations } from "next-intl";
// import ProfileButton from "@/components/common/ProfileButton/ProfileButton";

export const AuthActions = observer(() => {
  const t = useTranslations("nav");
  const [animationState, setAnimationState] = useState<"in" | "out" | null>(
    null,
  );
  const [showButton, setShowButton] = useState(appStore.isLoggedIn);

  // Trigger animation on login/logout toggle
  useEffect(() => {
    setAnimationState("out");
    const timeout = setTimeout(() => {
      setShowButton(appStore.isLoggedIn);
      setAnimationState("in");
    }, 300); // match animation duration
    return () => clearTimeout(timeout);
  }, [appStore.isLoggedIn]);

  const commonClass =
    animationState === "in"
      ? "animation-button-rotate-in"
      : animationState === "out"
        ? "animation-button-rotate-out"
        : "";

  return (
    <div className="flex gap-2 items-center">
      <LinkWithRedirecting href="/profile">
        <Button size="md" variant="flat">
          <ProfileIcon className="size-6 text-default-500" />
        </Button>
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
