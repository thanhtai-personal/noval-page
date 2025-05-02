import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string; // ví dụ: Admin, User, Moderator
}

export const RoleSchema = SchemaFactory.createForClass(Role);
