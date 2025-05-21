'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApiInstant } from '@/utils/api';
import { Button } from '@heroui/button';

export default function ChapterPage() {
  const { slug, index } = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadChapter = useCallback(async () => {
    setLoading(true);
    const res = await ApiInstant.get(`/chapters/${slug}/${index}`);
    setChapter(res.data);
    localStorage.setItem(`read-${slug}`, index?.toString() || '0');
    setLoading(false);
  }, [slug, index]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  // Vuốt ngang trên mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      if (dx < -100) handleNext();
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [index, slug]);

  const handleNext = () => {
    const nextIndex = parseInt(index as string, 10) + 1;
    router.push(`/truyen/${slug}/chuong/${nextIndex}`);
  };

  const handleBackToList = () => {
    router.push(`/truyen/${slug}`);
  };

  if (loading) return <p className="p-4">Đang tải chương...</p>;
  if (!chapter) return <p className="p-4">Không tìm thấy chương.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-center">{chapter.name}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: chapter.content }} />
      <div className="flex justify-between mt-6">
        <Button size="sm" onClick={handleBackToList}>← Danh sách chương</Button>
        <Button size="sm" onClick={handleNext}>Chương tiếp →</Button>
      </div>
    </div>
  );
}
