import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

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
  @ApiProperty({ required: true, type: UpdateUserDto })
  @ValidateNested()
  readonly user: UpdateUserDto;
}
