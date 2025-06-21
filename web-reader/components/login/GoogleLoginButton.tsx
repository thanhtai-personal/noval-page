import { useGoogleLogin } from "@react-oauth/google";

export const GoogleLoginButton = ({
  handleLoginSuccess,
  label
}: any) => {

  const login = useGoogleLogin({
    onSuccess: (data: any) => {
      console.log('login data', data)
      handleLoginSuccess?.(data);
    },
    flow: 'auth-code',
  });

  return (
    <a href="" onClick={() => login()}>{label}</a>
  )
}