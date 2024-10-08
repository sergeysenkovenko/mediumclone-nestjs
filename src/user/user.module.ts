import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '@app/user/guards/auth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
  exports: [UserService],
})
export class UserModule {}
