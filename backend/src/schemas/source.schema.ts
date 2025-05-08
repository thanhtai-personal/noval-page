// src/modules/source/schemas/source.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SourceDocument = Source & Document;

@Schema({ timestamps: true })
export class Source {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  baseUrl: string;

  @Prop({ default: 'idle' }) // 'idle' | 'crawling'
  status: string;

  @Prop()
  lastCrawledUrl?: string;

  @Prop()
  currentInfo?: string;

  @Prop()
  currentPage?: number;

  @Prop()
  totalPages?: number;

  @Prop()
  currentStory?: string;

  @Prop()
  state?: string;

  @Prop({ type: [String], default: [] }) // 🆕 để lưu slug các truyện đã crawl
  processedStorySlugs: string[];
}

export const SourceSchema = SchemaFactory.createForClass(Source);
