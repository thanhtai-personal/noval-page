import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ChapterDetailPage() {
  const { id, storySlug } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapter() {
      try {
        const res = await api.get(`stories/${storySlug}/chapters/${id}`);
        setChapter(res.data);
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [id]);

  if (loading) return <p className="p-6">Đang tải chương...</p>;
  if (!chapter) return <p className="p-6 text-red-500">Không tìm thấy chương</p>;

  return (
    <div className="p-6 max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{chapter.title || `Chương ${chapter.chapterNumber}`}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ngày tạo: {new Date(chapter.createdAt).toLocaleString('vi-VN')}
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: chapter.content || '<i>(Không có nội dung)</i>' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
