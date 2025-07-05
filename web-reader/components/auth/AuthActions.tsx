"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";

import { LinkWithRedirecting } from "@/components/common/utils/LinkWithRedirecting";
import { appStore } from "@/store/AppStore.store";
import { AnimationLogoutButton } from "@/components/animations/logoutBtn/AnimationLogoutButton";
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
          className={`${commonClass} logout-btn bg-red-500`}
          label={t("logout")}
          onLogout={async () => await appStore.logout()}
        />
      ) : (
        <LinkWithRedirecting
          className={`${commonClass} login-btn bg-green-800`}
          href="/login"
        >
          <AnimationLogoutButton label={t("login")} />
        </LinkWithRedirecting>
      )}
    </div>
  );
});
