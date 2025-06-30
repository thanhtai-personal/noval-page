import { useGoogleLogin } from "@react-oauth/google";
import { ThunderText } from "@/components/libs/ThunderText/ThunderText";
import { useTranslations } from "next-intl";
import { observer } from "mobx-react-lite";
import { useAppStore } from "@/store/Provider";

export const GoogleLoginButton = observer(
  ({
    handleLoginSuccess,
    label,
  }: {
    handleLoginSuccess: (codeResponse: { code: string }) => void;
    label: string;
  }) => {
    const t = useTranslations("login");
    const appStore = useAppStore();

    const login = useGoogleLogin({
      flow: "auth-code", // auth-code flow
      onSuccess: (codeResponse) => {
        console.log("Authorization code:", codeResponse.code);
        handleLoginSuccess(codeResponse); // will send `code` to backend
      },
      onError: (error) => {
        console.error("Google login error:", error);
      },
    });

    return (
      <div className="flex flex-col w-full">
        <div
          className="w-full cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            login();
          }}
        >
          {/* {appStore.animationMode ? (
            <ThunderText
              id="google-thunder-text"
              text={t("google")}
              width={500}
              height={500}
              speed={5}
            />
          ) : (
            t("login_with_google")
          )} */}
          {t("login_with_google")}
        </div>
      </div>
    );
  },
);
