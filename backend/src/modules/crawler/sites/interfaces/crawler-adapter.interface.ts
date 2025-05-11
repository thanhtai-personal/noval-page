// src/modules/crawler/sites/interfaces/crawler-adapter.interface.ts

export interface ICrawlerAdapter {
  /**
   * Crawl thông tin đầy đủ của một truyện (metadata + danh sách chương).
   */
  crawlStory(url: string): Promise<{
    title: string;
    slug: string;
    description?: string;
    author?: string;
    cover?: string;
    categories?: string[]; // 🆕 Thêm hỗ trợ category
    tags?: string[];       // 🆕 Thêm hỗ trợ tag
    chapters?: {
      title: string;
      url: string;
      slug: string;
      chapterNumber: number;
    }[];
  }>;

  /**
   * Crawl nội dung chương theo URL chương.
   */
  crawlChapterContent(url: string): Promise<any>;

  /**
   * Trả về danh sách tất cả các URL truyện từ trang chính.
   */
  crawlAllStoryUrls(successCallback?: () => void): Promise<void>; // 🆕 Dùng cho crawl site

  crawlStoryUrls(): Promise<void>;

  /**
   * Crawl nội dung chương theo URL chương.
   */
  crawlStoryDetailBySlug(slug: string): Promise<void>;

  crawlAllChaptersForStory(storyId: string): Promise<void>;
}
