import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  
  // Enable validation for DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('NestJS server is running on http://localhost:3000');
}

bootstrap();
