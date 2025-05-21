'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiInstant } from '@/utils/api';
import { Story } from '@/types/interfaces/story';
import { Pagination } from '@heroui/pagination';
import { Checkbox } from '@heroui/checkbox';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Badge } from '@heroui/badge';
import Link from 'next/link';

const ranges = [
  { label: '0 - 300', value: '0-300' },
  { label: '300 - 500', value: '300-500' },
  { label: '500 - 1000', value: '500-1000' },
  { label: '> 1000', value: '1000+' },
];

const StoryCard = ({ story }: { story: Story }) => (
  <Card>
    <CardHeader className="p-0">
      <img src={story.cover} alt={story.title} className="w-full h-48 object-cover rounded-t" />
    </CardHeader>
    <CardBody>
      <h2 className="text-lg font-semibold">{story.title}</h2>
      <p className="text-sm text-gray-600 mb-1">Tác giả: {story.author?.name}</p>
      <div
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: story.intro }}
      />
      <div className="flex flex-wrap gap-1 mt-2">
        {story.categories.map((cat) => (
          <Badge key={cat.slug} variant="flat" color="primary">{cat.name}</Badge>
        ))}
        {story.tags.map((tag) => (
          <Badge key={tag.name} variant="flat" color="secondary">{tag.name}</Badge>
        ))}
      </div>
    </CardBody>
    <CardFooter>
      <Link href={`/truyen/${story.slug}`}>
        <Button size="sm" variant="flat" color="primary">Đọc ngay</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function SearchPage() {
  const params = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 20;

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, tagRes, authorRes] = await Promise.all([
        ApiInstant.get('/categories'),
        ApiInstant.get('/tags'),
        ApiInstant.get('/authors'),
      ]);
      setCategories(catRes.data?.data || []);
      setTags(tagRes.data?.data || []);
      setAuthors(authorRes.data?.data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      const keyword = params.get('keyword') || '';
      const sort = params.get('sort') || '';
      const res = await ApiInstant.get(`/stories`, {
        params: { keyword, sort, page, limit },
      });
      setStories(res.data.data);
      setTotal(res.data.total);
    };
    fetchStories();
  }, [params, page]);

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filter panel */}
      <aside className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Danh mục</h3>
          {categories.map((cat) => (
            <Checkbox key={cat._id} value={cat.slug}>{cat.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Tác giả</h3>
          {authors.map((author) => (
            <Checkbox key={author._id} value={author._id}>{author.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Thẻ</h3>
          {tags.map((tag) => (
            <Checkbox key={tag._id} value={tag._id}>{tag.name}</Checkbox>
          ))}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Số chương</h3>
          {ranges.map((r) => (
            <Checkbox key={r.value} value={r.value}>{r.label}</Checkbox>
          ))}
        </div>
        <Button size="sm" className="mt-4 w-full">Áp dụng</Button>
      </aside>

      {/* Story result */}
      <section className="md:col-span-3 space-y-6">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
        {total > limit && (
          <div className="flex justify-center">
            <Pagination page={page} total={Math.ceil(total / limit)} onChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
}
