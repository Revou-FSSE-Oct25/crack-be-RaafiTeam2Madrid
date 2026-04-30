import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivesController } from './archives.controller';
import { ArchivesService } from './archives.service';
import { Archive } from './archive.entity';
// Import modul Audit Log
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Archive]),
    AuditLogsModule, // <- Tambahkan ke dalam array imports
  ],
  controllers: [ArchivesController],
  providers: [ArchivesService],
})
export class ArchivesModule {}