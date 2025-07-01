import { useQuery } from "@tanstack/react-query";
import { ApiInstant } from "@/utils/api";

interface Chapter {
  _id: string;
  title: string;
  index: number;
  slug: string;
}

async function fetchChapters(storySlug: string): Promise<Chapter[]> {
  if (!storySlug) return [];
  const res = await ApiInstant.get(`/stories/${storySlug}/chapters?page=1&limit=1000`);
  return res.data.data || [];
}

export function useChapters(storySlug: string) {
  const {
    data: chapters = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["chapters", storySlug],
    queryFn: () => fetchChapters(storySlug),
    enabled: !!storySlug, // chỉ fetch khi có storySlug
    staleTime: 1000 * 60 * 5, // optional: cache 5 phút
  });

  return {
    chapters,
    loading,
    error: error ? "Không thể tải danh sách chương" : null,
  };
}
