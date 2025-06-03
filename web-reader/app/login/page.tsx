"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { appStore } from "@/store/AppStore.store";
import { ApiInstant } from "@/utils/api";

export default function LoginPage() {
  const t = useTranslations("login");
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      // This will trigger server to set the token in cookies
      await ApiInstant.post(`/auth/google`, {
        idToken: credentialResponse.credential,
      });

      appStore.fetchProfile();

      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <div className="p-8 rounded shadow">
          <h1 className="text-xl mb-4">{t("login_with_google")}</h1>
          <GoogleLogin
            onError={() => console.error(t("login_error"))}
            onSuccess={handleLoginSuccess}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
