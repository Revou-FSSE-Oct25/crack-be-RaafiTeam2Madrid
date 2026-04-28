import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Archive } from './archive.entity';
import { Retention } from '../retentions/retention.entity';

@Injectable()
export class ArchivesService {
  constructor(
    @InjectRepository(Archive)
    private readonly archiveRepository: Repository<Archive>,
    @InjectRepository(Retention)
    private readonly retentionRepository: Repository<Retention>,
  ) {}

  async create(data: Partial<Archive>) {
    const archive = this.archiveRepository.create(data);
    return this.archiveRepository.save(archive);
  }

  async findAll() {
    return this.archiveRepository.find({ order: { uploadDate: 'DESC' } });
  }

  // --- FITUR 1: PENCARIAN (Yang tadi sempat hilang) ---
  async search(query: string, category?: string) {
    const searchCondition: any = [
      { title: Like(`%${query}%`) },
      { code: Like(`%${query}%`) },
    ];

    let results = await this.archiveRepository.find({
      where: searchCondition,
      order: { uploadDate: 'DESC' },
    });

    if (category && category !== 'Semua') {
      results = results.filter(a => a.category === category);
    }

    return results;
  }

  // --- FITUR 2: PENYUSUTAN JRA (Yang baru ditambahkan) ---
  async getDisposalSchedule() {
    const archives = await this.archiveRepository.find();
    const retentions = await this.retentionRepository.find();

    const scheduled = archives.map(archive => {
      const baseCode = archive.code.split('.')[0];
      const rule = retentions.find(r => r.code === baseCode);

      if (!rule) return { ...archive, statusJRA: 'Aturan Tidak Ditemukan', action: 'N/A' };

      const uploadDate = new Date(archive.uploadDate);
      const currentDate = new Date();
      
      const inactiveDate = new Date(uploadDate);
      inactiveDate.setFullYear(uploadDate.getFullYear() + rule.activeYears);

      const finalDate = new Date(inactiveDate);
      finalDate.setFullYear(inactiveDate.getFullYear() + rule.inactiveYears);

      let statusJRA = 'Masih Aktif';
      let action = 'Simpan';

      if (currentDate >= finalDate) {
        statusJRA = `Waktunya ${rule.finalAction}`;
        action = rule.finalAction === 'Musnah' ? 'MUSNAHKAN' : 'PERMANENKAN';
      } else if (currentDate >= inactiveDate) {
        statusJRA = 'Waktunya Inaktif';
        action = 'PINDAHKAN KE INAKTIF';
      }

      return {
        ...archive,
        statusJRA,
        action,
        inactiveDate: inactiveDate.toISOString(),
        finalDate: finalDate.toISOString(),
      };
    });

    return scheduled;
  }

  async remove(id: string) {
    await this.archiveRepository.delete(id);
    return { message: 'Arsip berhasil dihapus' };
  }
}