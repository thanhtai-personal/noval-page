import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ })
  username: string;

  @Prop({ required: true })
  password: string; // hashed password

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({  })
  photo: string;

  @Prop({  })
  name: string;

  @Prop({ default: false })
  banned: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;

  @Prop({ default: 0 })
  levelNumber?: number;

  @Prop({ default: 0 })
  exp?: number;

  @Prop({ default: 0 })
  coin?: number;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
