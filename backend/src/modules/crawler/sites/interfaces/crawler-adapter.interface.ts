export interface ICrawlerAdapter {
  crawlStory(url: string): Promise<{
    title: string;
    slug: string;
    description?: string;
    author?: string;
    cover?: string;
    chapters?: {
      title: string;
      url: string;
      slug: string;
      chapterNumber: number;
    }[];
  }>;

  crawlChapterContent(url: string): Promise<string>; // 🆕
}
