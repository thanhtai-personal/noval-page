import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  content: string;

  @Prop()
  cover: string;

  @Prop({ default: 0 })
  views: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
