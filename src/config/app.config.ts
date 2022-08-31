import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('HOST', 'localhost'),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DB'),
    port: config.get<number>('DB_PORT', 5432),
    synchronize: config.get('ENV') === 'production' ? false : true,
    autoLoadEntities: true,
  }),
  inject: [ConfigService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
  ],
};
