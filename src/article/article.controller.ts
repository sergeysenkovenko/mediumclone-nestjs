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
import { BackendValidationPipe } from '@app/pipes/backendValidation.pipe';

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
  @ApiQuery({
    name: 'favorited',
    required: false,
    type: String,
    description: 'Username',
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

  @Get('/feed')
  @UseGuards(AuthGuard)
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get feed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feed data received',
    type: ArticlesResponseDto,
  })
  async getFeed(
    @User('id') userId: number,
    @Query() query: Pick<IQueryParams, 'limit' | 'offset'>,
  ): Promise<ArticlesResponseDto> {
    return await this.articleService.getFeed(userId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
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
    @Body() articleUpdateDto: UpdateArticleRequestDto,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.updateArticle(
      userId,
      slug,
      articleUpdateDto.article,
    );

    return this.articleService.createArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', required: true, description: 'Article slug' })
  @ApiOperation({ summary: 'Add article to favorites' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article added to favorites',
    type: ArticleResponseDto,
  })
  async favorite(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.addArticleToFavorites(
      userId,
      slug,
    );

    return this.articleService.createArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'slug', required: true, description: 'Article slug' })
  @ApiOperation({ summary: 'Remove article from favorites' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article removed from favorites',
    type: ArticleResponseDto,
  })
  async unFavorite(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.removeArticleFromFavorites(
      userId,
      slug,
    );

    return this.articleService.createArticleResponse(article);
  }
}
