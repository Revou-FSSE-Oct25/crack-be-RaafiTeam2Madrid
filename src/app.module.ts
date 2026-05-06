import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Import Modul Fitur
import { ArchivesModule } from './archives/archives.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // Import modul user yang baru dibuat
import { AccessRequestsModule } from './access-requests/access-requests.module';

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
      password: 'admin', // pw db
      database: 'edrms_db', // nama database
      autoLoadEntities: true,
      synchronize: true, // Sinkronisasi otomatis struktur tabel
    }),

    // Registrasi Fitur-Fitur Utama
    ArchivesModule,
    AuditLogsModule,
    AuthModule,
    UsersModule, // Memastikan modul user aktif
    AccessRequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}