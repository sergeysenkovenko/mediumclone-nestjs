import { UserEntity } from '@app/user/user.entity';

export interface IUserResponse {
  user: Omit<UserEntity, 'hashPassword'> & { token: string };
}
