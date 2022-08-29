import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app/app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_WHITELIST.split(','),
  });
  await app.listen(process.env.PORT, () =>
    console.log(`Server started on port: ${process.env.PORT}`),
  );
}
bootstrap();
