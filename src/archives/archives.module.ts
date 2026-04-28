import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archive } from './archive.entity';
import { Retention } from '../retentions/retention.entity'; // <-- 1. Import tabel JRA
import { ArchivesService } from './archives.service';
import { ArchivesController } from './archives.controller';

@Module({
  // 2. Tambahkan Retention ke dalam daftar fitur di ruangan ini
  imports: [TypeOrmModule.forFeature([Archive, Retention])], 
  providers: [ArchivesService],
  controllers: [ArchivesController],
})
export class ArchivesModule {}