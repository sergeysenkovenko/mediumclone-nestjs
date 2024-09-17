import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, user);
    return await this.userRepository.save(newUser);
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  createUserResponse(user: UserEntity) {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
