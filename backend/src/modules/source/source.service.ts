// src/modules/source/source.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Source, SourceDocument } from '@/schemas/source.schema';
import { Model } from 'mongoose';

@Injectable()
export class SourceService {
  private crawlingMap = new Map<string, boolean>();

  constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
  ) {}

  async findAll(): Promise<Source[]> {
    return this.sourceModel.find().sort({ name: 1 }).lean();
  }
}
