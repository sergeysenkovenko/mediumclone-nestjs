import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly body?: string;
}

export class UpdateArticleRequestDto {
  @ApiProperty({ required: true, type: UpdateArticleDto })
  @ValidateNested()
  @Type(() => UpdateArticleDto)
  readonly article: UpdateArticleDto;
}
