import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { CreateUserResponseDto } from '@app/user/dto/createUser.dto';
import { IUserResponse } from '@app/user/types/userResponse.interface';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Created',
    type: CreateUserResponseDto,
  })
  async create(
    @Body() userCreateDto: CreateUserResponseDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.create(userCreateDto.user);
    return this.userService.createUserResponse(user);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User Authorized',
    type: CreateUserResponseDto,
  })
  async login(
    @Body() userCreateDto: CreateUserResponseDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.create(userCreateDto.user);
    return this.userService.createUserResponse(user);
  }
}
