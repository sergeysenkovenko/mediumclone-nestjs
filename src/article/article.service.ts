import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { UserEntity } from '@app/user/user.entity';
import {
  ArticleResponseDto,
  CreateArticleDto,
  UpdateArticleDto,
} from '@app/article/dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    articleCreateDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();
    Object.assign(newArticle, articleCreateDto);

    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.slug = this.getSlug(articleCreateDto.title);
    newArticle.author = currentUser;

    return await this.articleRepository.save(newArticle);
  }

  async deleteArticle(userId: number, slug: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (userId !== article.author.id) {
      throw new HttpException(
        'You are not an author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    userId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (userId !== article.author.id) {
      throw new HttpException(
        'You are not an author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticleDto);

    if (updateArticleDto.title) {
      article.slug = this.getSlug(updateArticleDto.title);
    }

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    return article;
  }

  createArticleResponse(article: ArticleEntity): ArticleResponseDto {
    return { article };
  }

  private getSlug(title: string): string {
    return slugify(`${title}-${uuidv4()}`, { lower: true });
  }
}
