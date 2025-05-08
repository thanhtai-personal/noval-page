import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';

@Injectable()
export class VtruyenCrawler implements ICrawlerAdapter {
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

    while (hasMore && page <= 100) { // giới hạn để tránh infinite loop
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
  
  getAllStoryUrls(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
}
