import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Mengaktifkan CORS agar Frontend bisa berkomunikasi dengan Backend
  app.enableCors();
  
  // Membuka akses folder 'uploads' secara publik
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  
  await app.listen(3001);
  console.log('Backend EDRMS berjalan di: http://localhost:3001');
}
bootstrap();