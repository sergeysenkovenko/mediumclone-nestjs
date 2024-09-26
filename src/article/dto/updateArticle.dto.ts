import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly description: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly body: string;
}

export class UpdateArticleRequestDto {
  @ApiProperty({ required: true, type: UpdateArticleDto })
  @ValidateNested()
  @Type(() => UpdateArticleDto)
  readonly article: UpdateArticleDto;
}
