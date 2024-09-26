import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleDataDto } from '@app/article/dto/articleResponse.dto';
import { Type } from 'class-transformer';

export class ArticlesResponseDto {
  @ApiProperty({ required: true, isArray: true, type: ArticleDataDto })
  @ValidateNested({ each: true })
  @Type(() => ArticleDataDto)
  articles: ArticleDataDto[];

  @ApiProperty({ required: true })
  articlesCount: number;
}
