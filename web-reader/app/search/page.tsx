import { Suspense } from "react";
import SearchPageClient from "@/components/SearchPageClient";

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
