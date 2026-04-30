import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Archive } from './archive.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ArchivesService {
  private readonly logger = new Logger(ArchivesService.name);

  constructor(
    @InjectRepository(Archive)
    private archivesRepository: Repository<Archive>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(archiveData: any, user: any) {
    const newArchive = this.archivesRepository.create(archiveData as object);
    const savedArchive: any = await this.archivesRepository.save(newArchive);

    await this.auditLogsService.create({
      action: 'CREATE',
      performedBy: user?.name || 'Sistem',
      targetId: savedArchive.id,
      details: `Registrasi arsip baru: ${savedArchive.title || 'Tanpa Judul'}. Retensi: ${savedArchive.retentionDate || 'Tidak diset'}`,
    });

    return savedArchive;
  }

  async update(id: string, updateData: any, user: any) {
    await this.archivesRepository.update(id, updateData);
    
    await this.auditLogsService.create({
      action: 'UPDATE',
      performedBy: user?.name || 'Sistem',
      targetId: id,
      details: `Memperbarui metadata & jadwal retensi arsip`,
    });

    return this.archivesRepository.findOne({ where: { id } as any });
  }

  async remove(id: string, user: any) {
    const archive: any = await this.archivesRepository.findOne({ where: { id } as any });
    if (archive) {
      await this.archivesRepository.delete(id);
      await this.auditLogsService.create({
        action: 'DELETE',
        performedBy: user?.name || 'Sistem',
        targetId: id,
        details: `Menghapus arsip: ${archive.title || id}`,
      });
    }
    return { message: 'Arsip berhasil dihapus' };
  }

  async findAll() {
    return this.archivesRepository.find();
  }

  async search(query: string, category: string) {
    const qb = this.archivesRepository.createQueryBuilder('archive');
    if (query && query.trim() !== '') {
      qb.andWhere('(LOWER(archive.title) LIKE LOWER(:query) OR LOWER(archive.code) LIKE LOWER(:query))', { query: `%${query}%` });
    }
    if (category && category !== 'Semua') {
      qb.andWhere('LOWER(archive.category) = LOWER(:category)', { category });
    }
    return await qb.orderBy('archive.uploadDate', 'DESC').getMany();
  }

  async findOne(id: string) {
    return this.archivesRepository.findOne({ where: { id } as any });
  }

  // =========================================================================
  // ROBOT CRON JOB: EKSEKUTOR PEMUSNAHAN OTOMATIS
  // Saat ini disetel jalan setiap 10 detik untuk testing. 
  // Nanti saat skripsi, ubah ke: @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // =========================================================================
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleAutomatedDisposal() {
    const today = new Date();
    
    // Cari semua arsip yang tanggal retensinya sudah lewat atau sama dengan hari ini
    const expiredArchives = await this.archivesRepository.find({
      where: {
        retentionDate: LessThanOrEqual(today),
      },
    });

    if (expiredArchives.length > 0) {
      this.logger.warn(`Ditemukan ${expiredArchives.length} arsip yang habis masa retensinya. Memulai pemusnahan otomatis...`);

      for (const archive of expiredArchives) {
        // 1. Hapus arsipnya
        await this.archivesRepository.delete(archive.id);
        
        // 2. Catat ke Audit Log bahwa SISTEM yang menghapus otomatis
        await this.auditLogsService.create({
          action: 'DELETE',
          performedBy: 'AUTO-DISPOSAL SYSTEM',
          targetId: archive.id,
          details: `Pemusnahan otomatis berdasarkan JRA. Arsip: ${archive.title}`,
        });

        this.logger.log(`Berhasil memusnahkan arsip: ${archive.title}`);
      }
    }
  }
}