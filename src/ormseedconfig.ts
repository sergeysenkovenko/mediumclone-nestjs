import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '@app/ormconfig';

export const getTypeOrmSeedConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  ...getTypeOrmConfig(configService),
  migrations: ['src/seeds/*.ts'],
});
