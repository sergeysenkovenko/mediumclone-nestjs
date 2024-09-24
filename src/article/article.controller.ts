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
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
import { ArticlesResponseDto } from '@app/article/dto/articlesResponse.dto';
import { IQueryParams } from '@app/article/types/queryParams.interface';

@ApiTags('Articles')
@ApiBearerAuth()
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Count of elements per page',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Pagination offset',
  })
  @ApiQuery({
    name: 'author',
    required: false,
    type: String,
    description: 'Author username',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    description: 'Tag name',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get articles list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Articles list received',
    type: ArticlesResponseDto,
  })
  async findAll(
    @User() user: UserEntity,
    @Query() query: IQueryParams,
  ): Promise<ArticlesResponseDto> {
    return await this.articleService.findAll(user?.id, query);
  }

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
