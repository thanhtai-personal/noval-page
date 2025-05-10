// src/components/shared/AppLoader.tsx
import { Loader2 } from 'lucide-react';

export const AppLoader = ({ message = 'Đang tải trang...' }: { message?: string }) => {
  return (
    <div className="w-screen flex flex-col items-center justify-center min-h-screen text-muted-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
};