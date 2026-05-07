import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Archive } from './archive.entity';

@Injectable()
export class ArchivesService {
  constructor(
    @InjectRepository(Archive)
    private archivesRepository: Repository<Archive>,
  ) {}

  create(createArchiveDto: any, user: any) {
    const newArchive = this.archivesRepository.create(createArchiveDto);
    return this.archivesRepository.save(newArchive);
  }

  findAll() {
    return this.archivesRepository.find({
      where: { isDestroyed: false },
      order: { uploadDate: 'DESC' },
    });
  }

  search(query: string, category: string) {
    const queryBuilder = this.archivesRepository.createQueryBuilder('archive')
      .where('archive.isDestroyed = :isDestroyed', { isDestroyed: false });

    if (query) {
      queryBuilder.andWhere(
        '(LOWER(archive.title) LIKE LOWER(:query) OR LOWER(archive.code) LIKE LOWER(:query))',
        { query: `%${query}%` }
      );
    }
    if (category) {
      queryBuilder.andWhere('LOWER(archive.category) = LOWER(:category)', { category });
    }

    return queryBuilder.getMany();
  }

  findDestroyed() {
    return this.archivesRepository.find({
      where: { isDestroyed: true },
      order: { destroyedAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const archive = await this.archivesRepository.findOne({ where: { id } });
    if (!archive) {
      throw new NotFoundException(`Arsip dengan ID ${id} tidak ditemukan`);
    }
    return archive;
  }

  async update(id: string, updateArchiveDto: any, user: any) {
    await this.archivesRepository.update(id, updateArchiveDto);
    return this.findOne(id);
  }

  // FITUR BARU: Mengaktifkan/Menonaktifkan Legal Hold
  async toggleLegalHold(id: string, isLegalHold: boolean, reason: string, user: any) {
    const archive = await this.findOne(id);
    await this.archivesRepository.update(id, {
      isLegalHold: isLegalHold,
      legalHoldReason: isLegalHold ? reason : null,
    });
    return this.findOne(id);
  }

  // PROTEKSI LEGAL HOLD SAAT PEMUSNAHAN
  async remove(id: string, user: any) {
    const archive = await this.findOne(id);
    
    // Cegat jika arsip sedang dibekukan!
    if (archive.isLegalHold) {
      throw new BadRequestException('Akses Ditolak: Arsip ini sedang dalam status Legal Hold (Dibekukan) dan dilindungi oleh sistem dari pemusnahan.');
    }
    
    await this.archivesRepository.update(id, {
      isDestroyed: true,
      destroyedAt: new Date(),
      destroyedBy: user.name || 'Aditya Raafi Yudhatama (2026)'
    });

    return { message: 'Arsip berhasil dimusnahkan secara logis', archive };
  }
}