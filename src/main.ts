import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Membuat aplikasi NestJS
  const app = await NestFactory.create(AppModule);

  /**
   * AKTIFKAN CORS (Cross-Origin Resource Sharing)
   * Ini wajib agar Next.js (port 3000) bisa mengambil data
   * dari NestJS (port 3001) tanpa diblokir oleh browser.
   */
  app.enableCors({
    origin: 'http://localhost:3000', // Izin khusus untuk frontend kamu
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Menjalankan backend di port 3001
  await app.listen(3001);

  console.log('--------------------------------------------------');
  console.log('🚀 BACKEND EDRMS BERHASIL DIJALANKAN');
  console.log('📡 Endpoint API: http://localhost:3001');
  console.log('--------------------------------------------------');
}

bootstrap();
