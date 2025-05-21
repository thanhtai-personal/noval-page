import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStoryListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  categories?: string[];

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  chapterRange?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 20;
}
