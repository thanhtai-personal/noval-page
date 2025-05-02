import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // hashed password

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
