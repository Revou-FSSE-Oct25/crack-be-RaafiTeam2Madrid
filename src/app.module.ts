import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Archive } from './archives/archive.entity';
import { AuditLog } from './audit-logs/audit-log.entity';
import { Retention } from './retentions/retention.entity';

import { ArchivesModule } from './archives/archives.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { RetentionsModule } from './retentions/retentions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module'; // 1. Pastikan ini di-import

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin', 
      database: 'edrms_db',
      entities: [User, Archive, AuditLog, Retention],
      synchronize: true,
    }),
    ArchivesModule,
    AuditLogsModule,
    RetentionsModule,
    AuthModule,
    UsersModule, // 2. Tambahkan ini ke dalam daftar!
  ],
})
export class AppModule {}