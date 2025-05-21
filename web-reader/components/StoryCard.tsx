'use client';

import { Story } from '@/types/interfaces/story';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import Link from 'next/link';

export const StoryCard = ({ story, isSlide }: { story: Story; isSlide?: boolean }) => (
  <Card key={story._id}>
    <CardHeader className="p-0">
      <img
        src={story.cover}
        alt={story.title}
        className={isSlide ? `w-auto h-[calc(100vh/2.8)] object-cover rounded-t mx-auto` : `w-full h-48 object-cover rounded-t`}

      />
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
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>👁️ Lượt đọc: {story.views}</p>
        <p>📖 Số chương: {story.totalChapters}</p>
        <p>🌟 Bình chọn: {story.votes} | ❤️ Yêu thích: {story.likes} | 📌 Đề cử: {story.recommends}</p>
      </div>
    </CardBody>
    <CardFooter>
      <Link href={`/truyen/${story.slug}`}>
        <Button size="sm" variant="flat" color="primary">Đọc ngay</Button>
      </Link>
    </CardFooter>
  </Card>
);
