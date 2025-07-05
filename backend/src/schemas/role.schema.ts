import { RoleSlug } from '@/constants/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true, enum: RoleSlug, unique: true })
  slug: RoleSlug;

  @Prop({ required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
