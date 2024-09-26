import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly image?: string;
}

export class UpdateUserRequestDto {
  @ApiProperty({ required: true, type: UpdateUserDto })
  @ValidateNested()
  @Type(() => UpdateUserDto)
  readonly user: UpdateUserDto;
}
