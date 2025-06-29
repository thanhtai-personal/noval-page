import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { api } from "@/services/api";

export interface Source {
  _id: string;
  name: string;
  status: "idle" | "crawling";
  lastCrawledUrl?: string;
  currentInfo?: string;
  updatedAt?: string;
}

interface SourceCardProps {
  source: Source;
}

export const SourceCard = ({
  source,
}: SourceCardProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const statusColor =
    source.status === "crawling" ? "text-yellow-600" : "text-green-600";
  const statusLabel =
    source.status === "crawling" ? "🔄 Đang crawl..." : "✅ Sẵn sàng";

  const handleCrawl = async () => {
    setIsLoading(true);
    try {
      await api.post(`/crawler/source/${source._id}/crawl`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrawlChapters = async () => {
    setIsLoading(true);
    try {
      await api.post(`/crawler/source/${source._id}/crawl-chapters`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCrawlChaptersContent = async () => {
    setIsLoading(true);
    try {
      await api.post(`/crawler/source/${source._id}/crawl-chapters/content`);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between gap-8">
        <div className="space-y-1">
          <CardTitle className="text-lg">{source.name}</CardTitle>
          <p className={`text-sm font-medium ${statusColor}`}>
            Trạng thái: {statusLabel}
          </p>
          <p className="text-sm text-muted-foreground">
            🕒 Lần cuối cập nhật:{" "}
            {source.updatedAt
              ? new Date(source.updatedAt).toLocaleString("vi-VN")
              : "Không rõ"}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-8">
          <Button variant="default" onClick={handleCrawl} disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "🚀 Crawl All"}
          </Button>
          <Button variant="default" onClick={handleCrawlChapters} disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "🚀 Crawl chapters"}
          </Button>
          <Button variant="default" onClick={handleCrawlChaptersContent} disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "🚀 Crawl chapters content"}
          </Button>
          <Button variant="outline" onClick={toggleExpand}>
            {expanded ? "Ẩn" : "Xem thêm"}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <>
          <Separator />
          <CardContent className="text-sm text-muted-foreground mt-2 space-y-2">
            <p>
              ➡️ Đang crawl tới:{" "}
              <span className="font-mono text-primary">
                {source.currentInfo || source.lastCrawledUrl || "Chưa bắt đầu"}
              </span>
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
};
