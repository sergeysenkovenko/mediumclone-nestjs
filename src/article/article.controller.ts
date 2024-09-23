import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { User } from '@app/decorators/user.decorator';
import {
  ArticleResponseDto,
  CreateArticleRequestDto,
  UpdateArticleRequestDto,
} from '@app/article/dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article Created',
    type: ArticleResponseDto,
  })
  async create(
    @User() currentUser: UserEntity,
    @Body() articleCreateDto: CreateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.createArticle(
      currentUser,
      articleCreateDto.article,
    );

    return this.articleService.createArticleResponse(article);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', required: true, description: 'Article slug' })
  @ApiOperation({ summary: 'Get Article by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article data Received',
    type: ArticleResponseDto,
  })
  async getArticle(
    @Param('slug')
    slug: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.createArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', required: true, description: 'Article slug' })
  @ApiOperation({ summary: 'Delete Article by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article was deleted',
  })
  async delete(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.articleService.deleteArticle(userId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', required: true, description: 'Article slug' })
  @ApiOperation({ summary: 'Update Article by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article was updated',
    type: ArticleResponseDto,
  })
  async update(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body() articleUpdateDto: UpdateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.updateArticle(
      userId,
      slug,
      articleUpdateDto.article,
    );

    return this.articleService.createArticleResponse(article);
  }
}
