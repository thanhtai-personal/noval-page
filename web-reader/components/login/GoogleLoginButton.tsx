import { GoogleLogin } from "@react-oauth/google";
import { observer } from "mobx-react-lite";

export const GoogleLoginButton = observer(
  ({
    handleLoginSuccess,
    label: _label,
  }: {
    handleLoginSuccess: (token: string) => void;
    label: string;
  }) => {
    return (
      <div className="flex flex-col w-full">
        <GoogleLogin
          onError={() => {
            console.error("Google login error:");
          }}
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              console.log("ID token:", credentialResponse.credential);
              handleLoginSuccess(credentialResponse.credential);
            }
          }}
        />
      </div>
    );
  },
);
