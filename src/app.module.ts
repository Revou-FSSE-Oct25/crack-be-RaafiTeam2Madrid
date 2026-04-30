import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Import Modul Fitur
import { ArchivesModule } from './archives/archives.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Import modul user yang baru dibuat

@Module({
  imports: [
    // Mengaktifkan fitur Cron Job untuk penyusutan otomatis
    ScheduleModule.forRoot(),

    // Konfigurasi Database PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin', // Gunakan password sesuai pengaturan DBeaver kamu
      database: 'edrms_db', // Nama database sesuai screenshot DBeaver kamu
      autoLoadEntities: true,
      synchronize: true, // Sinkronisasi otomatis struktur tabel di masa development
    }),

    // Registrasi Fitur-Fitur Utama
    ArchivesModule,
    AuditLogsModule,
    AuthModule,
    UsersModule, // Memastikan modul user aktif
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}