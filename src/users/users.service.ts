import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // OTOMATIS ISI ADMIN JIKA KOSONG
  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const admin = this.userRepository.create({
        name: 'Aditya Admin',
        email: 'admin@kearsipan.ui.ac.id',
        password: 'admin123',
        role: 'ADMIN'
      });
      await this.userRepository.save(admin);
      console.log('✅ Admin default berhasil dibuat!');
    }
  }

  findAll() {
    return this.userRepository.find({ order: { name: 'ASC' } });
  }

  create(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    await this.userRepository.delete(id);
    return { message: 'User berhasil dihapus' };
  }
}