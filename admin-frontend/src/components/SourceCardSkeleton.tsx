// src/components/source/SourceCardSkeleton.tsx
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SourceCardSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between gap-8">
        <div className="space-y-2 w-full">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
};
