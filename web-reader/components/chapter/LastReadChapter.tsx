"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { READ_PREFIX } from "@/utils/constants";

export function LastReadChapter({ slug }: { slug: string }) {
  const [lastRead, setLastRead] = useState<string | null>("0");
  const t = useTranslations("profile");

  useEffect(() => {
    const saved = localStorage.getItem(`${READ_PREFIX}${slug}`);

    if (saved) setLastRead(saved);
  }, [slug]);

  return (
    <div>
      <p className="text-sm text-blue-600 mt-2">
        {`Bạn đã đọc tới chương ${lastRead}`}
        {/* {(
          t("you_have_read_up_to_chapter") || "Bạn đã đọc tới chương {0}"
        ).replace("{0}", `${lastRead ?? 0}`)} */}
      </p>
    </div>
  );
}
