export interface Story {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  totalChapters: number;
  likes: number;
  views: number;
  votes: number;
  createdAt: string;
  updatedAt: string;
}