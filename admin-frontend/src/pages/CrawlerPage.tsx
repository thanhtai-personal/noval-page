// src/pages/CrawlerPage.tsx
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { SourceCard } from '@/components/SourceCard';

interface Source {
  _id: string;
  name: string;
  status: 'idle' | 'crawling';
  lastCrawledUrl?: string;
  currentInfo?: string;
}

export default function CrawlerPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState<{ [id: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchSources = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/source');
      setSources(res.data);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCrawl = async (id: string) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      await api.post(`/source/${id}/crawl`);
      await fetchSources();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCancel = async (id: string) => {
    await api.post(`/source/${id}/cancel`);
    await fetchSources();
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="w-full p-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">📚 Quản lý Crawl Nguồn Truyện</h1>
        <Button variant="outline" size="sm" onClick={fetchSources} disabled={refreshing}>
          {refreshing ? 'Đang tải...' : '🔄 Refresh'}
        </Button>
      </div>

      {sources.map((src) => (
        <SourceCard
          key={src._id}
          source={src}
          isExpanded={expanded === src._id}
          isLoading={loadingMap[src._id]}
          onCrawl={() => handleCrawl(src._id)}
          onCancel={() => handleCancel(src._id)}
          onToggleExpand={() => toggleExpand(src._id)}
        />
      ))}
    </div>
  );
}