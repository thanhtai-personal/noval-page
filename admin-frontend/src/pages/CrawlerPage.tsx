import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface Source {
  id: string;
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
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">📚 Quản lý Crawl Nguồn Truyện</h1>
        <button
          onClick={fetchSources}
          className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 text-sm"
          disabled={refreshing}
        >
          {refreshing ? 'Đang tải...' : '🔄 Refresh'}
        </button>
      </div>

      {sources.map((src) => (
        <div key={src.id} className="border rounded p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">{src.name}</h2>
              <p className="text-sm">
                Trạng thái: {src.status === 'crawling' ? '🔄 Crawling...' : '✅ Idle'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => handleCrawl(src.id)}
                disabled={src.status === 'crawling' || loadingMap[src.id]}
              >
                {loadingMap[src.id] ? 'Đang gửi...' : 'Crawl All'}
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={() => handleCancel(src.id)}
                disabled={src.status !== 'crawling'}
              >
                Cancel
              </button>
              <button
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                onClick={() => toggleExpand(src.id)}
              >
                {expanded === src.id ? 'Ẩn' : 'Xem thêm'}
              </button>
            </div>
          </div>
          {expanded === src.id && (
            <div className="text-sm text-gray-700 mt-2 border-t pt-2">
              <p>➡️ Đang crawl tới: <span className="font-mono">{src.currentInfo || src.lastCrawledUrl || 'Chưa bắt đầu'}</span></p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
