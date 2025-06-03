import { Suspense } from "react";

import SearchPageClient from "@/components/searchPage/SearchPageClient";

export const metadata = {
  title: "Tìm kiếm truyện hay | Vô Ưu Các",
  description:
    "Tìm kiếm truyện tiên hiệp, kiếm hiệp, huyền huyễn hấp dẫn theo từ khóa, thể loại, tác giả hoặc số chương.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
          Đang chuyển trang...
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
