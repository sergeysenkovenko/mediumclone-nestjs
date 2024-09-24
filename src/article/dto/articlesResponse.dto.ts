import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleDataDto } from '@app/article/dto/articleResponse.dto';

export class ArticlesResponseDto {
  @ApiProperty({ required: true, isArray: true, type: ArticleDataDto })
  @ValidateNested()
  articles: ArticleDataDto[];

  @ApiProperty({ required: true })
  articlesCount: number;
}
