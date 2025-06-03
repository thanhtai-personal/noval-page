import { useEffect, useState } from "react";

import { ApiInstant } from "@/utils/api";

interface Chapter {
  _id: string;
  title: string;
  index: number;
  slug: string;
}

export function useChapters(storySlug: string) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storySlug) return;
    setLoading(true);
    ApiInstant.get(`/stories/${storySlug}/chapters?page=1&limit=1000`)
      .then((res) => {
        setChapters(res.data.data || []);
        setError(null);
      })
      .catch((err) => setError("Không thể tải danh sách chương"))
      .finally(() => setLoading(false));
  }, [storySlug]);

  return { chapters, loading, error };
}
