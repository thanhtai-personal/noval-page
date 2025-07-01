import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Story', required: true })
  story: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 1 })
  expValue: number;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'ChapterContent' })
  content: Types.ObjectId;

  @Prop({ required: true })
  chapterNumber: number;

  @Prop()
  url: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
