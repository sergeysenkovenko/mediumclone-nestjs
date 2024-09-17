import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { CreateUserResponseDto } from '@app/user/dto/createUser.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User Created',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User with this ID already exists',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden resource',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  async create(@Body() userCreateDto: CreateUserResponseDto): Promise<any> {
    const user = await this.userService.create(userCreateDto.user);
    return this.userService.createUserResponse(user);
  }
}
