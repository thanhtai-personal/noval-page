'use client';

import { useState } from 'react';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { SearchIcon } from '@/components/default/icons';
import { useRouter } from 'next/navigation';

export function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Tìm truyện..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        type="search"
      />
    </form>
  );
}
