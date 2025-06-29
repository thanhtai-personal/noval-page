import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level } from "@/schemas/level.schema";
import { DBNames } from "@/utils/dbConfig";

@Injectable()
export class LevelService {
  constructor(@InjectModel(Level.name, DBNames.ums) private readonly levelModel: Model<Level>) {}
}
