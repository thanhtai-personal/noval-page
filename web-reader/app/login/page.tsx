import dynamic from "next/dynamic";

// Dynamically import the client-side LoginPageContent component
const LoginPageContent = dynamic(
  () => import("@/components/login/LoginPageContent"),
);

export default function LoginPage() {
  return <LoginPageContent />;
}
