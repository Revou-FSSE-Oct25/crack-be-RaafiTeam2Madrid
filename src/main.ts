import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// 1. IMPORT SWAGGER
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2. KONFIGURASI CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // OPTIONS wajib untuk preflight upload file
    credentials: true,
  });

  // 3. JALUR AKSES FOLDER PDF
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // 4. KONFIGURASI SWAGGER
  const config = new DocumentBuilder()
    .setTitle('EDRMS Vokasi UI API')
    .setDescription('Dokumentasi API untuk Sistem Pengelolaan Arsip Dinamis (EDRMS)')
    .setVersion('1.0')
    .addBearerAuth() // Menambahkan fitur gembok login JWT di Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 5. PENYESUAIAN PORT UNTUK RAILWAY
  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  
  console.log('--------------------------------------------------');
  console.log('🚀 BACKEND EDRMS BERHASIL DIJALANKAN');
  console.log('📂 Static File Server (PDF) AKTIF di folder /uploads');
  console.log('📖 Dokumentasi Swagger AKTIF di /api');
  console.log('--------------------------------------------------');
}

bootstrap();