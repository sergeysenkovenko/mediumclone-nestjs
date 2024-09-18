import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import {
  CreateUserRequestDto,
  LoginUserRequestDto,
  UserResponseDto,
} from '@app/user/dto';
import { User } from '@app/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Created',
    type: UserResponseDto,
  })
  async create(
    @Body() userCreateDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(userCreateDto.user);
    return this.userService.createUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Authorized',
    type: UserResponseDto,
  })
  async login(
    @Body() userLoginDto: LoginUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.login(userLoginDto.user);
    return this.userService.createUserResponse(user);
  }

  @Get('user')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data received',
    type: UserResponseDto,
  })
  async currentUser(@User() user: UserEntity): Promise<UserResponseDto> {
    return this.userService.createUserResponse(user);
  }
}
