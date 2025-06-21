import { useGoogleLogin } from "@react-oauth/google";

export const GoogleLoginButton = ({
  handleLoginSuccess,
  label,
}: {
  handleLoginSuccess: (codeResponse: { code: string }) => void;
  label: string;
}) => {
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
    <button
      onClick={(e) => {
        e.preventDefault();
        login();
      }}
    >
      {label}
    </button>
  );
};
