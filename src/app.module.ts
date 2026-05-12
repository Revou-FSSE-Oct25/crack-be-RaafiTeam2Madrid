import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

// Import Modul Fitur
import { ArchivesModule } from './archives/archives.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccessRequestsModule } from './access-requests/access-requests.module';
import { RetentionsModule } from './retentions/retentions.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // Pastikan ConfigModule berada di paling atas agar .env terbaca lebih dulu
    ConfigModule.forRoot({ isGlobal: true }),

    ScheduleModule.forRoot(),

    // Konfigurasi Database PostgreSQL (Supabase Cloud via Connection Pooler)
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Mengambil URL dari file .env agar kredensial aman
      url: process.env.DATABASE_URL, 
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        // Optimasi untuk koneksi pooler Supabase
        max: 20, 
      },
    }),

    ArchivesModule,
    AuditLogsModule,
    AuthModule,
    UsersModule,
    AccessRequestsModule,
    RetentionsModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}