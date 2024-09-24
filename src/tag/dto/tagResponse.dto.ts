import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({ required: true })
  tags: string[];
}
