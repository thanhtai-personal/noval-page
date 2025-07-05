import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetChapterListDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 50;

  @IsOptional()
  sort?: string;
}
