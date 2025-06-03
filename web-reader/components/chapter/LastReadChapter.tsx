"use client";

import { useEffect, useState } from "react";

export function LastReadChapter({ slug }: { slug: string }) {
  const [lastRead, setLastRead] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`read-${slug}`);

    if (saved) setLastRead(saved);
  }, [slug]);

  return (
    <p className="text-sm text-blue-600 mt-2">
      Bạn đã đọc tới chương {lastRead ?? 0}
    </p>
  );
}
