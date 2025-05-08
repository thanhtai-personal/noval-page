// src/components/source/SourceCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SourceCardProps {
  source: {
    _id: string;
    name: string;
    status: 'idle' | 'crawling';
    lastCrawledUrl?: string;
    currentInfo?: string;
  };
  isExpanded: boolean;
  isLoading: boolean;
  onCrawl: () => void;
  onCancel: () => void;
  onToggleExpand: () => void;
}

export const SourceCard = ({
  source,
  isExpanded,
  isLoading,
  onCrawl,
  onCancel,
  onToggleExpand,
}: SourceCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between gap-8">
        <div>
          <CardTitle className="text-lg">{source.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Trạng thái:{' '}
            {source.status === 'crawling' ? '🔄 Crawling...' : '✅ Idle'}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-8">
          {source.status === 'idle' && (
            <Button variant="default" onClick={onCrawl} disabled={isLoading}>
              {isLoading ? 'Đang gửi...' : '🚀 Crawl All'}
            </Button>
          )}
          {source.status === 'crawling' && (
            <Button variant="destructive" onClick={onCancel}>
              ⛔ Cancel
            </Button>
          )}
          <Button variant="outline" onClick={onToggleExpand}>
            {isExpanded ? 'Ẩn' : 'Xem thêm'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <>
          <Separator />
          <CardContent className="text-sm text-muted-foreground mt-2">
            ➡️ Đang crawl tới:{' '}
            <span className="font-mono text-primary">
              {source.currentInfo || source.lastCrawledUrl || 'Chưa bắt đầu'}
            </span>
          </CardContent>
        </>
      )}
    </Card>
  );
};
