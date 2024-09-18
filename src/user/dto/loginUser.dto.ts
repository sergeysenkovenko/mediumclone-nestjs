import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '@app/user/dto';

export class LoginUserDto extends OmitType(CreateUserDto, ['username']) {}

export class LoginUserRequestDto {
  @ApiProperty({ required: true })
  @ValidateNested()
  @Type(() => LoginUserDto)
  readonly user: LoginUserDto;
}
