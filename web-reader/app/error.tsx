"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    // Log the error to an error reporting service

    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{t("something_wrong")}</h2>
      <button onClick={() => reset()} onTouchEnd={() => reset()}>
        {t("try_again")}
      </button>
    </div>
  );
}
