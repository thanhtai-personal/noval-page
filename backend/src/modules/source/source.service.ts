// src/modules/source/source.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Source, SourceDocument } from '@/schemas/source.schema';
import { Model } from 'mongoose';

@Injectable()
export class SourceService {
  private crawlingMap = new Map<string, boolean>();

  constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
  ) {}

  async findAll(): Promise<Source[]> {
    return this.sourceModel.find().sort({ name: 1 }).lean();
  }

  async startCrawl(sourceId: string) {
    const source = await this.sourceModel.findById(sourceId);
    if (!source || source.status === 'crawling') return;

    this.crawlingMap.set(sourceId, true);
    await this.sourceModel.findByIdAndUpdate(sourceId, { status: 'crawling' });

    let currentUrl = source.lastCrawledUrl || source.baseUrl;

    for (let i = 1; i <= 10; i++) {
      if (!this.crawlingMap.get(sourceId)) break;

      const currentInfo = `Truyện ABC - Chương ${i}`;
      await this.sourceModel.findByIdAndUpdate(sourceId, {
        currentInfo,
        lastCrawledUrl: `${currentUrl}?p=${i}`,
      });

      await new Promise((r) => setTimeout(r, 1000)); // mô phỏng delay crawl
    }

    await this.sourceModel.findByIdAndUpdate(sourceId, { status: 'idle' });
    this.crawlingMap.delete(sourceId);
  }

  cancelCrawl(sourceId: string) {
    this.crawlingMap.set(sourceId, false);
  }
}
