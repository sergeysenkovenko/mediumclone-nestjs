import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmSeedConfig } from '@app/ormseedconfig';

ConfigModule.forRoot({
  isGlobal: true,
});

const configService = new ConfigService();

export default new DataSource(getTypeOrmSeedConfig(configService));
