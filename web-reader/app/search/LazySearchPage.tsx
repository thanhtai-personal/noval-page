"use client";

import dynamic from "next/dynamic";

const LazySearchClient = dynamic(
  () => import("@/components/searchPage/SearchPageClient"),
  { ssr: false },
);

const LazySearchPage = (props: any) => {
  return <LazySearchClient {...props} />;
};

export default LazySearchPage;
