import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserDataDto } from '@app/user/dto';

export class ProfileDataDto extends OmitType(UserDataDto, ['token', 'email']) {
  @ApiProperty()
  following: boolean;
}

export class ProfileResponseDto {
  @ApiProperty({ required: true, type: ProfileDataDto })
  @ValidateNested()
  profile: ProfileDataDto;
}
