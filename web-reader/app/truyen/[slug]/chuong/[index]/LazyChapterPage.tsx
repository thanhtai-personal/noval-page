"use client";

import dynamic from "next/dynamic";

const ChapterPageClient = dynamic(
  () => import("@/components/chapter/ChapterDetailPageClient"),
  { ssr: false },
);

const LazyChapterPage = (props: any) => {
  return <ChapterPageClient {...props} />;
};

export default LazyChapterPage;
