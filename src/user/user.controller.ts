import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
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
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UpdateUserRequestDto } from '@app/user/dto/updateUser.dto';
import { BackendValidationPipe } from '@app/pipes/backendValidation.pipe';

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
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
  @UsePipes(new BackendValidationPipe())
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
  @UseGuards(AuthGuard)
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

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated',
    type: UserResponseDto,
  })
  async update(
    @User('id') userId: number,
    @Body() userUpdateDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.update(
      userId,
      userUpdateDto.user,
    );
    return this.userService.createUserResponse(updatedUser);
  }
}
