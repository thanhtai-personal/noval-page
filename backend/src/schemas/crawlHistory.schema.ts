import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class CrawlHistory extends Document {
  @Prop({ default: 0 })
  totalPage: number;

  @Prop({ default: 1 })
  currentPage: number;

  @Prop({ type: Types.ObjectId, ref: 'sourceName' })
  source?: Types.ObjectId; // Reference to the source schema
}

export const CrawlHistorySchema = SchemaFactory.createForClass(CrawlHistory);
