import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Story extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Author' })
  author: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  categories: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: Types.ObjectId[];

  @Prop()
  description: string;

  @Prop()
  intro: string;

  @Prop()
  cover: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Source' }] })
  source: Types.ObjectId[];

  @Prop()
  url: string;

  @Prop({ default: 0 })
  totalChapters: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  recommends: number;

  @Prop({ default: 0 })
  votes: number;

  @Prop({ default: 1 })
  expValue: number;

  @Prop({ default: false })
  isDetailCrawled: boolean;

  @Prop({ default: false })
  isChapterCrawled: boolean;
}

export const StorySchema = SchemaFactory.createForClass(Story);
