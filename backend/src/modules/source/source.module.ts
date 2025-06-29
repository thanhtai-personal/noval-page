// src/modules/source/source.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Source, SourceSchema } from '@/schemas/source.schema';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { DBNames } from "@/utils/database";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }], DBNames.story1),
  ],
  controllers: [SourceController],
  providers: [SourceService],
})
export class SourceModule {}
