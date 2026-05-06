import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 1. TAMBAHKAN DUA IMPORT INI DI ATAS:
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // 2. UBAH CARA PEMBUATAN APP MENJADI EXPRESS APPLICATION
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. BUKA JALUR AKSES KE FOLDER PENYIMPANAN PDF
  // Asumsi file PDF kamu tersimpan di folder bernama 'uploads' di root backend
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  await app.listen(3001);
  
  console.log('--------------------------------------------------');
  console.log('🚀 BACKEND EDRMS BERHASIL DIJALANKAN');
  console.log('📂 Static File Server (PDF) AKTIF di folder /uploads');
  console.log('--------------------------------------------------');
}

bootstrap();