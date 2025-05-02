import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetAuthorListDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 30;
}
