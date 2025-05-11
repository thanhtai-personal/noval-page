import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoryData() {
      try {
        const [storyRes, chaptersRes] = await Promise.all([
          api.get(`/stories/${id}`),
          api.get(`/stories/${id}/chapters?limit=50&sort=-chapterNumber`),
        ]);
        setStory(storyRes.data);
        setChapters(chaptersRes.data.data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchStoryData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-96 w-full rounded" />
      </div>
    );
  }

  if (!story) {
    return <p className="p-6 text-red-500">❌ Không tìm thấy truyện</p>;
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex gap-6">
        <img
          src={story.cover || '/placeholder.jpg'}
          alt={story.title}
          className="w-40 h-60 rounded border object-cover"
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{story.title}</h1>

          <div className="text-sm text-muted-foreground">
            <strong>Tác giả:</strong> {story.author?.name || 'Không rõ'}
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Nguồn:</strong>{' '}
            {story.url ? (
              <a href={story.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {story.source}
              </a>
            ) : story.source || 'Không rõ'}
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Thể loại:</strong>{' '}
            {(story.categories || []).map((c: any) => (
              <Badge key={c._id} variant="outline" className="mr-1">{c.name}</Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Tags:</strong>{' '}
            {(story.tags || []).map((t: any) => (
              <Badge key={t._id} variant="secondary" className="mr-1">{t.name}</Badge>
            ))}
          </div>

          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>📖 <strong>{story.totalChapters || 0}</strong> chương</span>
            <span>👁️ {story.views || 0} lượt đọc</span>
            <span>👍 {story.likes || 0} lượt thích</span>
            <span>⭐ {story.recommends || 0} đề cử</span>
          </div>
        </div>
      </div>

      {story.intro && (
        <Card>
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {story.intro}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mô tả</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {story.description ? <div dangerouslySetInnerHTML={{ __html: story.description }} /> : 'Chưa có mô tả'}
          </p>
        </CardContent>
      </Card>

      {/* ✅ 50 chương mới nhất */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Chương mới nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {chapters.map((ch) => (
              <a
                key={ch._id}
                href={`/reader/${story.slug}/${ch.chapterNumber}`}
                className="block text-sm hover:text-blue-600 hover:underline"
              >
                <Card className="p-3 h-full">
                  <p className="font-medium">Chương {ch.chapterNumber}</p>
                  <p className="text-muted-foreground">{ch.title}</p>
                </Card>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
