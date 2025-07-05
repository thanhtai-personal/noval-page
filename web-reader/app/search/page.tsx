import { Suspense } from "react";
import { useTranslations } from "next-intl";

import LazySearchPage from "./LazySearchPage";
export const metadata = {
  title: "Tìm kiếm truyện hay | Vô Ưu Các",
  description:
    "Tìm kiếm truyện tiên hiệp, kiếm hiệp, huyền huyễn hấp dẫn theo từ khóa, thể loại, tác giả hoặc số chương.",
};

export default function Page() {
  const t = useTranslations("search");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
          {t("loading")}
        </div>
      }
    >
      <LazySearchPage />
    </Suspense>
  );
}
