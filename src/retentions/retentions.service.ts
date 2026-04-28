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
    // KESALAHAN TERJADI DI SINI SEBELUMNYA
    // Kita ubah 'classificationCode' menjadi 'code' agar sesuai dengan Entity
    return this.retentionRepository.find({ order: { code: 'ASC' } });
  }

  create(data: Partial<Retention>) {
    const retention = this.retentionRepository.create(data);
    return this.retentionRepository.save(retention);
  }

  async remove(id: string) {
    await this.retentionRepository.delete(id);
    return { message: 'Aturan JRA berhasil dihapus' };
  }
}