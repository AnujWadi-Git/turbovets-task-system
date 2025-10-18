import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', // Allow all origins for demo
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = 3000; // Changed from 3000 to 3333
  await app.listen(port);
  
  Logger.log(`🚀 Backend running on: http://localhost:${port}/api`);
}

bootstrap();