"use client";

import dynamic from "next/dynamic";

const HomePageContent = dynamic(
  () => import("@/components/home/HomePageContent"),
  { ssr: false },
);

const LazyHomePage = (props: any) => {
  return <HomePageContent {...props} />;
};

export default LazyHomePage;
