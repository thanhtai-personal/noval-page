import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';
import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '@/schemas/category.schema';
import { Story } from '@/schemas/story.schema';
import { Author } from '@/schemas/author.schema';
import { Tag } from '@/schemas/tag.schema';

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  constructor(
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {}

  async crawlStory(url: string) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('h1').first().text().trim();
    const description = $('.desc-text').text().trim();
    const author = $('.info a[href*="/tac-gia/"]').text().trim();
    const cover = $('.book img').attr('src') || '';
    const slug = slugify(title);

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

    while (hasMore && page <= 500) {
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

  async getAllStoryUrls(): Promise<void> {
    const source = await this.sourceModel.findOne({ name: 'Tangthuvien' });
    if (!source) throw new Error('Source not found');
    console.log(`🔍 Bắt đầu crawl site: ${source.baseUrl}`);

    let currentPage = source.currentPage || 1;
    let totalPages = source.totalPages || 0;
    const processedSlugs = new Set(source.processedStorySlugs || []);

    try {
      const { data } = await axios.get(`${source.baseUrl}/ket-qua-tim-kiem?page=1`);
      const $ = cheerio.load(data);
      totalPages = Number($('.pagination li').length - 2);
      await this.sourceModel.updateOne({ _id: source._id }, { totalPages });
    } catch (err) {
      console.error(`❌ Lỗi khi lấy tổng số trang: ${err.message}`);
    }
    console.log("totalPages", totalPages);

    for (let page = currentPage; page <= totalPages; page++) {
      console.log(`📄 Đang xử lý trang ${page}`);
      try {
        const { data: searchData } = await axios.get(`${source.baseUrl}/ket-qua-tim-kiem?page=${page}`);
        const $ = cheerio.load(searchData);

        const stories = $('#rank-view-list .book-img-text ul li')
          .map((_, el) => {
            const anchor = $(el).find('a').first();
            const href = anchor.attr('href');
            const title = anchor.text().trim();

            return {
              url: href?.startsWith('http') ? href : `${source.baseUrl}${href}`,
              title,
              slug: slugify(title),
              author: $(el).find('.author').text().trim(),
              cover: $(el).find('img').attr('src'),
              intro: $(el).find('.desc').text().trim(),
            };
          })
          .get()
          .filter(s => s.url && s.title);

        if (stories.length === 0) {
          console.log('✅ Không còn truyện nào, dừng tại trang', page);
          break;
        }

        for (const s of stories) {
          if (processedSlugs.has(s.slug)) continue;

          // Tác giả
          let authorDoc: any = null;
          if (s.author) {
            const authorSlug = slugify(s.author);
            authorDoc = await this.authorModel.findOneAndUpdate(
              { slug: authorSlug },
              { name: s.author },
              { upsert: true, new: true }
            );
          }

          // Crawl chi tiết để lấy category, tag
          const { data: detailHtml } = await axios.get(s.url);
          const $detail = cheerio.load(detailHtml);

          const rawCategories = $detail('.info a[href*="/the-loai/"]')
            .map((_, el) => $detail(el).text().trim())
            .get();

          const rawTags = $detail('.info a[href*="/tu-khoa/"]')
            .map((_, el) => $detail(el).text().trim())
            .get();

          const categoryIds = await Promise.all(
            rawCategories.map(async (name) => {
              const slug = slugify(name);
              const cat = await this.categoryModel.findOneAndUpdate(
                { slug },
                { name },
                { upsert: true, new: true }
              );
              return cat._id;
            })
          );

          const tagIds = await Promise.all(
            rawTags.map(async (name) => {
              const slug = slugify(name);
              const tag = await this.tagModel.findOneAndUpdate(
                { slug },
                { name },
                { upsert: true, new: true }
              );
              return tag._id;
            })
          );

          await this.storyModel.create({
            title: s.title,
            slug: s.slug,
            url: s.url,
            description: s.intro,
            cover: s.cover,
            author: authorDoc?._id,
            source: source.name,
            categories: categoryIds,
            tags: tagIds,
          });

          processedSlugs.add(s.slug);
          await this.sourceModel.updateOne(
            { _id: source._id },
            {
              currentPage: page,
              lastCrawledUrl: s.url,
              currentStory: s.title,
              $addToSet: { processedStorySlugs: s.slug },
            }
          );

          console.log(`✅ Lưu truyện: ${s.title}`);
        }
      } catch (err) {
        console.warn(`❌ Lỗi khi crawl trang ${page}: ${err.message}`);
        break;
      }
    }

    console.log('🏁 Crawl site Tangthuvien hoàn tất.');
  }
}
