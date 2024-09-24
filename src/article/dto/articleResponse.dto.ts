import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserDataDto } from '@app/user/dto';

class AuthorDto extends OmitType(UserDataDto, ['token']) {}

export class ArticleDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  tagList: Array<string>;

  @ApiProperty()
  favoritesCount: number;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;
}

export class ArticleResponseDto {
  @ApiProperty({ required: true, type: ArticleDataDto })
  @ValidateNested()
  article: ArticleDataDto;
}
