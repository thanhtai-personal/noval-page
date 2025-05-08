import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  async crawlStory(url: string) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1').first().text().trim();
    const description = $('.desc-text').text().trim();
    const author = $('.info a[href*="/tac-gia/"]').text().trim();
    const cover = $('.book img').attr('src') || '';
    const slug = slugify(title);

    // Crawl danh sách chương từ trang chương (pagination)
    const storyIdMatch = url.match(/\/(\d+)$/);
    const storyId = storyIdMatch ? storyIdMatch[1] : null;
    if (!storyId) throw new Error('Không lấy được ID truyện');

    const chapters: {
      title: string;
      url: string;
      slug: string;
      chapterNumber: number;
    }[] = [];

    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 500) { // giới hạn để tránh infinite loop
      const chapterUrl = `https://truyen.tangthuvien.vn/doc-truyen/${storyId}/chuong-${page}`;
      try {
        const { data: pageData } = await axios.get(chapterUrl);
        const $$ = cheerio.load(pageData);

        const chapterList = $$('.col-xs-12.chapter a');

        if (chapterList.length === 0) {
          hasMore = false;
          break;
        }

        chapterList.each((i, el) => {
          const chTitle = $$(el).text().trim();
          const chUrl = 'https://truyen.tangthuvien.vn' + $$(el).attr('href');
          chapters.push({
            title: chTitle,
            url: chUrl,
            slug: slugify(chTitle),
            chapterNumber: chapters.length + 1,
          });
        });

        page++;
      } catch (err) {
        hasMore = false;
        break;
      }
    }

    return {
      title,
      slug,
      description,
      author,
      cover,
      chapters,
    };
  }

  async crawlChapterContent(url: string): Promise<string> {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const contentHtml = $('.box-chap').html()?.trim() || '';
      return contentHtml;
    } catch (err) {
      console.warn(`Không thể crawl chương: ${url}`);
      return '';
    }
  }

  async getAllStoryUrls(): Promise<string[]> {
    const baseUrl = 'https://truyen.tangthuvien.vn/danh-sach?page=';
    const urls: string[] = [];

    let page = 1;
    const maxPages = 1000;

    console.log('🚀 Bắt đầu thu thập URL truyện từ Tangthuvien...');

    while (page <= maxPages) {
      const url = `${baseUrl}${page}`;
      console.log(`📄 Đang xử lý trang ${page}: ${url}`);

      try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        const links = $('.book-img-text a.name')
          .map((_, el) => $(el).attr('href'))
          .get()
          .filter(Boolean);

        if (links.length === 0) {
          console.log('✅ Không còn truyện nào, dừng tại trang', page);
          break;
        }

        for (const link of links) {
          const fullUrl = `https://truyen.tangthuvien.vn${link}`;
          urls.push(fullUrl);
        }

        console.log(`➕ Đã thu thập ${links.length} truyện (tổng: ${urls.length})`);

        page++;
      } catch (err) {
        console.warn(`❌ Lỗi khi crawl trang ${page}: ${err.message}`);
        break;
      }
    }

    console.log(`🏁 Hoàn tất. Tổng số truyện thu được: ${urls.length}`);
    return urls;
  }

}
