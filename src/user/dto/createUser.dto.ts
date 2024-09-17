import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => CreateUserDto)
  readonly user: CreateUserDto;
}

export class LoginUserDto extends OmitType(CreateUserDto, ['username']) {}

export class LoginUserResponseDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => LoginUserDto)
  readonly user: LoginUserDto;
}
