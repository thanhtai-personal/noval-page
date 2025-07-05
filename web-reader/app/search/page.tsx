import { Suspense } from "react";
import { headers } from "next/headers";
import { createTranslator, getMessages } from "next-intl/server";
import { useTranslations } from "next-intl";

import LazySearchPage from "./LazySearchPage";
export async function generateMetadata() {
  const locale = headers().get("x-next-intl-locale") || "vi";
  const messages = await getMessages({ locale });
  const t = createTranslator({ locale, messages, namespace: "search" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

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
