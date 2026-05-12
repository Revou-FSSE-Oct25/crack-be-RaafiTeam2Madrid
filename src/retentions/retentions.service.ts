import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Retention } from './retention.entity';

@Injectable()
export class RetentionsService {
  constructor(
    @InjectRepository(Retention)
    private readonly retentionRepository: Repository<Retention>,
  ) {}

  findAll() {
    return this.retentionRepository.find({ order: { code: 'ASC' } });
  }

  create(data: Partial<Retention>) {
    const retention = this.retentionRepository.create(data);
    return this.retentionRepository.save(retention);
  }

  // --- TAMBAHAN: Fungsi untuk melakukan Update (Edit) ---
  async update(id: string, data: Partial<Retention>) {
    await this.retentionRepository.update(id, data);
    return this.retentionRepository.findOneBy({ id });
  }

  async remove(id: string) {
    await this.retentionRepository.delete(id);
    return { message: 'Aturan JRA berhasil dihapus' };
  }
}