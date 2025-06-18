import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Level extends Document {

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  levelNumber: string;

  @Prop({ default: 0 })
  neededExp?: number;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
