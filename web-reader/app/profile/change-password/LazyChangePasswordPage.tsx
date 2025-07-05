"use client";

import dynamic from "next/dynamic";

const ChangePasswordPageContent = dynamic(
  () => import("@/components/profile/ChangePasswordPageContent"),
  { ssr: false },
);

const LazyChangePasswordPage = (props: any) => {
  return <ChangePasswordPageContent {...props} />;
};

export default LazyChangePasswordPage;
