import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {Badge} from "@heroui/badge";
import { Button } from "@heroui/button";
import Link from "next/link";
import { ApiInstant } from "@/utils/api";
import { Story } from "@/types/interfaces/story";

async function fetchStories(): Promise<Story[]> {
  const res = await ApiInstant.get("/stories");
  return res.data?.data || [];
}

export default async function HomePage() {
  const stories = await fetchStories();

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Truyện Mới</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <Card key={story._id}>
            <CardHeader className="p-0">
              <img
                src={story.cover}
                alt={story.title}
                className="w-full h-48 object-cover rounded-t"
              />
            </CardHeader>
            <CardBody>
              <h2 className="text-lg font-semibold">{story.title}</h2>
              <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{__html: story.intro }}></div>
              <div className="flex flex-wrap gap-1 mt-2">
                {story.categories.map((cat) => (
                  <Badge key={cat.slug} variant="flat" color="primary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </CardBody>
            <CardFooter>
              <Link href={`/truyen/${story.slug}`}>
                <Button size="sm" variant="flat" color="primary">
                  Đọc ngay
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
