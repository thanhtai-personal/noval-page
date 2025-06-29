import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelController } from './level.controller';
import { Level, LevelSchema } from "@/schemas/level.schema";
import { LevelService } from "./level.service";
import { DBNames } from "@/utils/dbConfig";

@Module({
  imports: [MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }], DBNames.ums)],
  controllers: [LevelController],
  providers: [LevelService],
})
export class LevelModule {}
