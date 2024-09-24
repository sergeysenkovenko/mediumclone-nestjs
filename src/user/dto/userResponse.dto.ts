import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class UserDataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  token?: string;
}

export class UserResponseDto {
  @ApiProperty({ required: true, type: UserDataDto })
  @ValidateNested()
  user: UserDataDto;
}
