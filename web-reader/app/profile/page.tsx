'use client';

import { useEffect, useState } from 'react';
import { appStore } from '@/store/AppStore.store';
import { Card, CardBody } from '@heroui/card';
import { Pagination } from '@heroui/pagination';
import { Avatar } from '@heroui/avatar';
import Link from 'next/link';

interface ReadItem {
  slug: string;
  index: string;
}
const PAGE_SIZE = 20;

export default function ProfilePage() {
  const [readItems, setReadItems] = useState<ReadItem[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const items: ReadItem[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('read-')) {
        const slug = key.replace('read-', '');
        const index = localStorage.getItem(key) || '0';
        items.push({ slug, index });
      }
    });
    setReadItems(items);
  }, []);

  const totalPages = Math.ceil(readItems.length / PAGE_SIZE);
  const paginated = readItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  console.log('profile', appStore.profile);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={appStore.profile?.name || 'Guest'} />
        <div>
          <h1 className="text-xl font-bold">{appStore.profile?.name || appStore.profile?.email || 'Guest'}</h1>
          <p className="text-sm text-gray-500">Trang cá nhân</p>
        </div>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold mb-4">Truyện đã đọc ({readItems.length})</h2>
          {paginated.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có truyện nào được lưu.</p>
          ) : (
            <ul className="space-y-2">
              {paginated.map(({ slug, index }) => (
                <li key={slug}>
                  <Link href={`/truyen/${slug}/chuong/${index}`}>
                    <span className="text-blue-600 hover:underline">
                      {slug.replace(/-/g, ' ')} - Đọc tới chương {index}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            total={totalPages}
            onChange={setPage}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
