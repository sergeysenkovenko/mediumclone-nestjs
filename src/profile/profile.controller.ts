import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/decorators/user.decorator';
import { ProfileService } from '@app/profile/profile.service';
import { ProfileResponseDto } from '@app/profile/dto';
import { UserEntity } from '@app/user/user.entity';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'username',
    required: true,
    description: 'Profile username',
  })
  @ApiOperation({ summary: 'Get profile by username' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile data Received',
    type: ProfileResponseDto,
  })
  async getProfile(
    @User() user: UserEntity,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findProfile(user?.id, username);
    return this.profileService.createProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'username',
    required: true,
    description: 'Profile username',
  })
  @ApiOperation({ summary: 'Follow user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User was follower',
    type: ProfileResponseDto,
  })
  async follow(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.followUser(userId, username);
    return this.profileService.createProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'username',
    required: true,
    description: 'Profile username',
  })
  @ApiOperation({ summary: 'Unfollow user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User was unfollowed',
    type: ProfileResponseDto,
  })
  async unFollow(
    @User('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.unfollowUser(userId, username);
    return this.profileService.createProfileResponse(profile);
  }
}
