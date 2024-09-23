import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  readonly title: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty({ required: false })
  readonly body: string;
}

export class UpdateArticleRequestDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => UpdateArticleDto)
  readonly article: UpdateArticleDto;
}
