import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface Source {
  _id: string;
  name: string;
  status: 'idle' | 'crawling';
  lastCrawledUrl?: string;
  currentInfo?: string;
  updatedAt?: string;
}

interface SourceCardProps {
  source: Source;
  isExpanded: boolean;
  isLoading: boolean;
  onCrawl: () => void;
  onToggleExpand: () => void;
}

export const SourceCard = ({
  source,
  isExpanded,
  isLoading,
  onCrawl,
  onToggleExpand,
}: SourceCardProps) => {
  const statusColor =
    source.status === 'crawling' ? 'text-yellow-600' : 'text-green-600';
  const statusLabel =
    source.status === 'crawling' ? '🔄 Đang crawl...' : '✅ Sẵn sàng';

  return (
    <Card className="w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between gap-8">
        <div className="space-y-1">
          <CardTitle className="text-lg">{source.name}</CardTitle>
          <p className={`text-sm font-medium ${statusColor}`}>
            Trạng thái: {statusLabel}
          </p>
          <p className="text-sm text-muted-foreground">
            🕒 Lần cuối cập nhật:{' '}
            {source.updatedAt
              ? new Date(source.updatedAt).toLocaleString('vi-VN')
              : 'Không rõ'}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-8">
          <Button variant="default" onClick={onCrawl} disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : '🚀 Crawl All'}
          </Button>
          <Button variant="outline" onClick={onToggleExpand}>
            {isExpanded ? 'Ẩn' : 'Xem thêm'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <Separator />
          <CardContent className="text-sm text-muted-foreground mt-2 space-y-2">
            <p>
              ➡️ Đang crawl tới:{' '}
              <span className="font-mono text-primary">
                {source.currentInfo || source.lastCrawledUrl || 'Chưa bắt đầu'}
              </span>
            </p>
          </CardContent>
        </>
      )}
    </Card>
  );
};
