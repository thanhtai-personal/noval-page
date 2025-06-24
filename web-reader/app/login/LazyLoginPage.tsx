"use client";

import dynamic from "next/dynamic";

const LoginPageContent = dynamic(
  () => import("@/components/login/LoginPageContent"),
  { ssr: false },
);

const LazyLoginPage = (props: any) => {
  return <LoginPageContent {...props} />;
};

export default LazyLoginPage;
