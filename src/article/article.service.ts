import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { UserEntity } from '@app/user/user.entity';
import {
  ArticleResponseDto,
  CreateArticleDto,
  UpdateArticleDto,
} from '@app/article/dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { ArticlesResponseDto } from '@app/article/dto/articlesResponse.dto';
import { IQueryParams } from '@app/article/types/queryParams.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,

    private dataSource: DataSource,
  ) {}

  async findAll(
    userId: number,
    query: IQueryParams,
  ): Promise<ArticlesResponseDto> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });

      if (!author)
        return {
          articles: [],
          articlesCount,
        };

      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((el) => el.id);

      if (!ids.length || !author)
        return {
          articles: [],
          articlesCount,
        };

      queryBuilder.andWhere('articles.id IN (:...ids)', {
        ids,
      });
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (userId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser.favorites.map((el) => el.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => {
      const favorited = favoriteIds.includes(article.id);
      return { ...article, favorited };
    });

    return {
      articles: articlesWithFavorites,
      articlesCount,
    };
  }

  async getFeed(
    userId: number,
    query: Pick<IQueryParams, 'limit' | 'offset'>,
  ): Promise<ArticlesResponseDto> {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
    });

    if (!follows.length)
      return {
        articles: [],
        articlesCount: 0,
      };

    const followingIds = follows.map((follow) => follow.followingId);

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const articles = await queryBuilder.getMany();

    return {
      articles,
      articlesCount,
    };
  }

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

  async addArticleToFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    const isAlreadyFavorited = user.favorites.some(
      (el) => el.id === article.id,
    );

    if (!isAlreadyFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async removeArticleFromFavorites(
    userId: number,
    slug: string,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    const articleIndex = user.favorites.findIndex((el) => el.id === article.id);

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
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
