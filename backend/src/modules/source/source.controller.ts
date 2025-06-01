// src/modules/source/source.controller.ts
import { Controller, Get, Post, Param } from '@nestjs/common';
import { SourceService } from './source.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  @Public()
  async getAll() {
    return this.sourceService.findAll();
  }
}
