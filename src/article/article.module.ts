import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '@app/article/article.entity';
import { ArticleService } from '@app/article/article.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
})
export class ArticleModule {}
