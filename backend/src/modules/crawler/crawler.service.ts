import { Injectable } from '@nestjs/common';
import { TangthuvienCrawler } from './sites/tangthuvien.crawler';
import { VtruyenCrawler } from './sites/vtruyen.crawler';
import { ICrawlerAdapter } from './sites/interfaces/crawler-adapter.interface';
import { slugify } from "@/utils/slugify";
import { Author } from "@/schemas/author.schema";
import { Chapter } from "@/schemas/chapter.schema";
import { Story } from "@/schemas/story.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, HydratedDocument } from "mongoose";

@Injectable()
export class CrawlerService {
  constructor(
    private readonly tangthuvienCrawler: TangthuvienCrawler,
    private readonly vtruyenCrawler: VtruyenCrawler,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
  ) { }

  private getAdapter(source: string): ICrawlerAdapter {
    switch (source) {
      case 'tangthuvien':
        return this.tangthuvienCrawler;
      case 'vtruyen':
        return this.vtruyenCrawler;
      default:
        throw new Error(`Unsupported source: ${source}`);
    }
  }

  async crawlAndSave(url: string, source: string) {
    const adapter = this.getAdapter(source);
    const data = await adapter.crawlStory(url);

    // 1. Tìm hoặc tạo tác giả
    let authorDoc: HydratedDocument<Author> | null = null;
    if (data.author) {
      const authorSlug = slugify(data.author);
      authorDoc = await this.authorModel.findOne({ slug: authorSlug });
      if (!authorDoc) {
        authorDoc = await this.authorModel.create({
          name: data.author,
          slug: authorSlug,
        });
      }
    }

    // 2. Tìm hoặc tạo truyện
    let storyDoc = await this.storyModel.findOne({ slug: data.slug });
    if (!storyDoc) {
      storyDoc = await this.storyModel.create({
        title: data.title,
        slug: data.slug,
        description: data.description,
        cover: data.cover,
        author: authorDoc?._id || null,
        source,
        url,
      });
    }

    // 3. Lưu danh sách chương (chỉ nếu chưa có)
    const existingChapters = await this.chapterModel.find({ story: storyDoc._id });
    if (existingChapters.length === 0 && data.chapters?.length) {
      const chaptersToInsert = data.chapters.map((ch: any, index) => ({
        title: ch.title,
        slug: ch.slug,
        url: ch.url,
        chapterNumber: ch.chapterNumber || index + 1,
        story: storyDoc._id,
      }));
      const insertedChapters = await this.chapterModel.insertMany(chaptersToInsert);
      
      // 🆕: Crawl nội dung từng chương
      for (const ch of insertedChapters) {
        const content = await adapter.crawlChapterContent(ch.url);
        ch.content = content;
        await ch.save();
      }
    }

    return {
      message: 'Crawl và lưu thành công',
      storyId: storyDoc._id,
      totalChapters: data.chapters?.length || 0,
    };
  }
}
