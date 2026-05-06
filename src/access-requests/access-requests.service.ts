import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessRequest } from './access-request.entity';

@Injectable()
export class AccessRequestsService {
  constructor(
    @InjectRepository(AccessRequest)
    private requestRepo: Repository<AccessRequest>,
  ) {}

  findAll() {
    return this.requestRepo.find({ order: { requestDate: 'DESC' } });
  }

  create(data: Partial<AccessRequest>) {
    const req = this.requestRepo.create(data);
    return this.requestRepo.save(req);
  }

  async updateStatus(id: string, status: string) {
    await this.requestRepo.update(id, { status });
    return this.requestRepo.findOneBy({ id });
  }
}