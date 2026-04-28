import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; // Import Tabel User
import { UsersService } from './users.service'; // Import Mesin Pengolah
import { UsersController } from './users.controller'; // Import Pintu Masuk Web

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // <--- INI WAJIB ADA agar URL /users bisa diakses
  providers: [UsersService], // <--- INI WAJIB ADA agar logika simpan/hapus bisa jalan
  exports: [UsersService],
})
export class UsersModule {}