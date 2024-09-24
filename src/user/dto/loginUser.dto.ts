import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { CreateUserDto } from '@app/user/dto';

export class LoginUserDto extends OmitType(CreateUserDto, ['username']) {}

export class LoginUserRequestDto {
  @ApiProperty({ required: true, type: LoginUserDto })
  @ValidateNested()
  readonly user: LoginUserDto;
}
