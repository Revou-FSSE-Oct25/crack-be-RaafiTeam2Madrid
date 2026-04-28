import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // --- INI DIA FUNGSI YANG BIKIN ERROR KALAU GAK ADA ---
  // Fungsi ini bertugas menyimpan log baru ke dalam database
  async create(logData: Partial<AuditLog>): Promise<AuditLog> {
    const newLog = this.auditLogsRepository.create(logData);
    return this.auditLogsRepository.save(newLog);
  }
}