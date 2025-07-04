import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ReadingHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Story', required: true })
  story: Types.ObjectId;

  @Prop({ required: true })
  chapter: number;
}

export const ReadingHistorySchema = SchemaFactory.createForClass(ReadingHistory);
