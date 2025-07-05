import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChapterContent extends Document {
  @Prop({ default: '' })
  slug: string;

  @Prop({ default: '' })
  content: string;

  @Prop({})
  chapter: string;

  @Prop({ type: Types.ObjectId, ref: 'Chapter' })
  chapterId: Types.ObjectId;
}

export const ChapterContentSchema =
  SchemaFactory.createForClass(ChapterContent);
