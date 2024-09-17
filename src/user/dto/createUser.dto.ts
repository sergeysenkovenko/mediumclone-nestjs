import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly password: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => CreateUserDto)
  readonly user: CreateUserDto;
}
