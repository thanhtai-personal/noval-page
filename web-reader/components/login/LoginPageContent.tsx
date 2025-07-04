"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { ApiInstant } from "@/utils/api";
import styles from "@/app/login/login.module.css";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { useAppStore } from "@/store/Provider";

const LoginPageContent = observer(() => {
  const t = useTranslations("login");
  const router = useRouter();
  const appStore = useAppStore();
  const { theme } = useTheme();

  // Mutation cho login
  const loginMutation = useMutation({
    mutationFn: async (idToken: string) => {
      await ApiInstant.post(`/auth/google`, { token: idToken });
      await appStore.fetchProfile();
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (err) => {
      // Bạn có thể hiển thị thông báo lỗi ở đây nếu muốn
      console.error("Login failed", err);
    },
  });

  // Xử lý gọi mutation khi Google trả về code
  const handleLoginSuccess = (idToken: string) => {
    loginMutation.mutate(idToken);
  };

  useEffect(() => {
    appStore.ui.setAnimations({
      useIsland: false,
      useDNA: false,
      use3DIsland: false,
      useFantasyIsland: false,
      useUniverseBg: theme === "dark",
    });

    return () => {
      appStore.ui.resetAnimations();
    };
  }, [theme]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="p-8 rounded shadow opacity-70">
          <div className={`${styles.box} relative`}>
            <div className="absolute w-full top-0 left-0 z-10 flex justify-center items-center pt-4">
              <h2 className={styles.h2}>
                <i className="fa-solid fa-right-to-bracket" />
                {t("click_to_login")}
                <i className="fa-solid fa-heart" />
              </h2>
            </div>
            <div className={`${styles.login}`}>
              <div className="loginBx flex flex-col justify-center items-center">
                <div className={`${styles.group} flex flex-col`}>
                  <GoogleLoginButton
                    handleLoginSuccess={handleLoginSuccess}
                    label={t("login_with_google")}
                  />
                  {loginMutation.isError && (
                    <div className="text-center mt-2 text-red-500">
                      {t("login_error") || "Đăng nhập thất bại!"}
                    </div>
                  )}
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
