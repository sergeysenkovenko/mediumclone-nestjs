import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '@app/ormconfig';

ConfigModule.forRoot({
  isGlobal: true,
});

const configService = new ConfigService();

export default new DataSource(getTypeOrmConfig(configService));
