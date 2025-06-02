export function StoryCardSkeleton() {
  return (
    <div className="border rounded shadow animate-pulse p-4 space-y-3">
      <div className="h-48 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
      <div className="flex gap-2 mt-2">
        <div className="h-4 bg-gray-300 rounded w-16" />
        <div className="h-4 bg-gray-300 rounded w-12" />
      </div>
    </div>
  );
}
