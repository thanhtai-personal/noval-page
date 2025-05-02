import { useState } from 'react';
import { api } from '@/services/api';

export default function CrawlerPage() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('tangthuvien');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleCrawl = async () => {
    console.log("call me!!")
    setLoading(true);
    setResult('');
    try {
      const res = await api.post('/crawler/crawl-save', { url, source });
      setResult(`✅ ${res.data.message} (${res.data.totalChapters} chương)`);
    } catch (err: any) {
      setResult('❌ Lỗi: ' + (err?.response?.data?.message || 'Không xác định'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📚 Crawl Truyện</h1>
      <input
        type="text"
        placeholder="URL truyện"
        className="w-full border p-2 rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <select
        className="w-full border p-2 rounded"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      >
        <option value="tangthuvien">Tangthuvien</option>
        <option value="vtruyen">Vtruyen</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleCrawl}
        disabled={loading || !url}
      >
        {loading ? 'Đang crawl...' : 'Crawl & Lưu'}
      </button>
      {result && <p className="text-sm">{result}</p>}
    </div>
  );
}
