import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { UserEntity } from '@app/user/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
})
export class UserModule {}
