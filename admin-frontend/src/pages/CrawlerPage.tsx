// src/pages/CrawlerPage.tsx
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Source, SourceCard } from "@/components/SourceCard";
import { SourceCardSkeleton } from "@/components/SourceCardSkeleton";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_WS_URL || "http://localhost:5000");

export default function CrawlerPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    sources.forEach((source) => {
      socket.on(`crawl:${source._id}`, (msg) => {
        setSources((prev) =>
          prev.map((s) =>
            s._id === source._id ? { ...s, currentInfo: msg } : s
          )
        );
      });

      socket.on(`crawl:status:${source._id}`, (status) => {
        setSources((prev) =>
          prev.map((s) => (s._id === source._id ? { ...s, status } : s))
        );
      });
    });

    return () => {
      sources.forEach((source) => {
        socket.off(`crawl:${source._id}`);
        socket.off(`crawl:status:${source._id}`);
      });
    };
  }, [sources]);

  const fetchSources = async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/source");
      setSources(res.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return (
    <div className="w-full p-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">
          📚 Quản lý Crawl Nguồn Truyện
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSources}
          disabled={refreshing}
        >
          {refreshing ? "Đang tải..." : "🔄 Refresh"}
        </Button>
      </div>

      {refreshing
        ? Array.from({ length: 2 }).map((_, i) => (
            <SourceCardSkeleton key={i} />
          ))
        : sources.map((src) => (
            <SourceCard
              key={src._id}
              source={src}
            />
          ))}
    </div>
  );
}
