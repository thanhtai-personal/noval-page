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
  crawlChapterContent(url: string): Promise<string>;

  /**
   * Trả về danh sách tất cả các URL truyện từ trang chính.
   */
  getAllStoryUrls(): Promise<string[]>; // 🆕 Dùng cho crawl site
}
