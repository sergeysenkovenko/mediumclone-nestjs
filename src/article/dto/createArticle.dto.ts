import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly body: string;

  @ApiProperty()
  readonly tagList?: Array<string>;
}

export class CreateArticleRequestDto {
  @ApiProperty({ required: true, type: CreateArticleDto })
  @ValidateNested()
  readonly article: CreateArticleDto;
}
