import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProfileDataDto, ProfileResponseDto } from '@app/profile/dto';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,

    private dataSource: DataSource,
  ) {}

  async followUser(userId: number, username: string): Promise<ProfileDataDto> {
    const user = await this.findProfile(userId, username);

    if (userId === user?.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: userId,
        followingId: user.id,
      },
    });

    if (!follow) {
      const createFollow = new FollowEntity();
      createFollow.followerId = userId;
      createFollow.followingId = user.id;
      await this.followRepository.save(createFollow);
    }

    return { ...user, following: true };
  }

  async unfollowUser(
    userId: number,
    username: string,
  ): Promise<ProfileDataDto> {
    const user = await this.findProfile(userId, username);

    if (userId === user?.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: userId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }

  async findProfile(userId: number, username: string): Promise<ProfileDataDto> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    delete user.email;

    if (userId) {
      const follow = await this.followRepository.findOne({
        where: {
          followerId: userId,
          followingId: user.id,
        },
      });

      return { ...user, following: Boolean(follow) };
    }

    return { ...user, following: false };
  }

  createProfileResponse(profile: ProfileDataDto): ProfileResponseDto {
    return { profile };
  }
}
