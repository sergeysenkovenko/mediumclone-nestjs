import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagService } from '@app/tag/tag.service';
import { TagResponseDto } from '@app/tag/dto';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tags data received',
    type: TagResponseDto,
  })
  async findAll(): Promise<TagResponseDto> {
    const tags = await this.tagService.findAll();

    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
