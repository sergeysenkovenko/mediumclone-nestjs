import { DataSourceOptions } from 'typeorm';

const TYPEORM_HOST = 'localhost';
const TYPEORM_USERNAME = 'mediumadmin';
const TYPEORM_PASSWORD = '123';
const TYPEORM_DATABASE = 'mediumclone';
const TYPEORM_PORT = 5432;

const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: TYPEORM_HOST,
  port: TYPEORM_PORT,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default ormconfig;
