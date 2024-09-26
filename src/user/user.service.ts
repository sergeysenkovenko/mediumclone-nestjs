import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { CreateUserDto, LoginUserDto } from '@app/user/dto';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { UserResponseDto } from '@app/user/dto/userResponse.dto';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or username': ['already exists'],
      },
    };

    const userByEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { email: user.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, user);
    const createdUser = await this.userRepository.save(newUser);
    delete createdUser.password;
    return createdUser;
  }

  async login(user: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        'email or password': ['invalid credentials'],
      },
    };

    const userByEmail = await this.userRepository.findOne({
      where: { email: user.email },
      select: ['id', 'username', 'bio', 'image', 'password'],
    });

    if (!userByEmail) {
      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }

    const isPasswordMatch = await compare(user.password, userByEmail.password);

    if (!isPasswordMatch) {
      throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
    }

    delete userByEmail.password;

    return userByEmail;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  generateJWT(user: UserEntity): string {
    const secretJWT = this.configService.get('JWT_ACCESS_SECRET');

    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      secretJWT,
    );
  }

  createUserResponse(user: UserEntity): UserResponseDto {
    return {
      user: {
        ...user,
        token: this.generateJWT(user),
      },
    };
  }
}
