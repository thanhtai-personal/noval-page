"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ApiInstant } from "@/utils/api";
import styles from "@/app/login/login.module.css";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const LoginPageContent = observer(() => {
  const t = useTranslations("login");
  const router = useRouter();
  const appStore = useAppStore();
  const { theme } = useTheme();

  const handleLoginSuccess = async (codeResponse: { code: string }) => {
    try {
      const { code } = codeResponse;

      await ApiInstant.post(`/auth/google`, {
        code,
      });

      await appStore.fetchProfile();
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  useEffect(() => {
    appStore.setAnimations({
      useIsland: false,
      useDNA: false,
      use3DIsland: false,
      useFantasyIsland: false,
      useUniverseBg: theme === "dark",
    });

    return () => {
      appStore.resetAnimations();
    };
  }, [theme]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="p-8 rounded shadow opacity-70">
          <div className={`${styles.box} relative`}>
            <div className="absolute w-full top-0 left-0 z-10 flex justify-center items-center pt-4">
              <h2 className={styles.h2}>
                <i className="fa-solid fa-right-to-bracket"></i>
                {t("click_to_login")}
                <i className="fa-solid fa-heart"></i>
              </h2>
            </div>
            <div className={`${styles.login}`}>
              <div className="loginBx flex flex-col justify-center items-center">
                <div className={styles.group}>
                  <GoogleLoginButton
                    label={t("login_with_google")}
                    handleLoginSuccess={handleLoginSuccess}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
});

export default LoginPageContent;
