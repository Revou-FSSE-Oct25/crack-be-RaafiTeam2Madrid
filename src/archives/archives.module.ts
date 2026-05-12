import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivesController } from './archives.controller';
import { ArchivesService } from './archives.service';
import { Archive } from './archive.entity';
// TAMBAHAN 1: Import module Cloudinary
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Archive]),
    CloudinaryModule, // TAMBAHAN 2: Masukkan ke sini
  ],
  controllers: [ArchivesController],
  providers: [ArchivesService],
  exports: [ArchivesService],
})
export class ArchivesModule {}
