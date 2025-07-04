export interface Story {
  _id: string;
  title: string;
  slug: string;
  description: string;
  intro: string;
  cover: string;
  totalChapters: number;
  views: number;
  likes: number;
  votes: number;
  recommends: number;
  categories: { name: string; _id: string; slug: string }[];
  tags: { name: string; _id: string; slug: string }[];
  author: { name: string; _id: string; slug: string };
  source: { name: string; _id: string; url: string };
}
