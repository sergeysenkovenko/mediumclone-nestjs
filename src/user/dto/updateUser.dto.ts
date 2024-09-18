import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  readonly username: string;

  @ApiProperty({ required: false })
  readonly email: string;

  @ApiProperty({ required: false })
  readonly bio: string;

  @ApiProperty({ required: false })
  readonly image: string;
}

export class UpdateUserRequestDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  readonly user: UpdateUserDto;
}
