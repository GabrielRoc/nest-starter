import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      logging: process.env.TYPEORM_LOGGING === 'true',
      uuidExtension: 'pgcrypto',
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class DatabaseModule {}
