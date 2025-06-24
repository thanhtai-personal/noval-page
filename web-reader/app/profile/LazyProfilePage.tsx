"use client";

import dynamic from "next/dynamic";

// Dynamically import the client-side ProfilePageContent component
const ProfilePageContent = dynamic(
  () => import("@/components/profile/ProfilePageContent"),
  { ssr: false },
);

const LazyProfilePage = (props: any) => {
  return <ProfilePageContent {...props} />;
};

export default LazyProfilePage;
