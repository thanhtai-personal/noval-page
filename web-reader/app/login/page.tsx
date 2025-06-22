"use client";

// import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { appStore } from "@/store/AppStore.store";
import { ApiInstant } from "@/utils/api";
import { LoginPageClientScripts } from "@/components/login/LoginPageClientScripts";

import styles from "./login.module.css";
import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();

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

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <LoginPageClientScripts />
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
                {/* <input type="text" placeholder="Username" className={styles.input} />
                <input type="password" placeholder="Password" className={styles.input} />
                <input type="submit" value="Sign in" className={styles.input} /> */}
                {/* <GoogleLogin
                  onError={() => console.error(t("login_error"))}
                  onSuccess={handleLoginSuccess}
                /> */}

                <div className={styles.group}>
                  {/* <a href="#">Forgot Password</a> */}
                  {/* <a href="#">Sign up</a> */}
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
}
