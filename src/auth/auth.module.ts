import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
// Import modul Audit Log
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuditLogsModule, // <- Tambahkan ke dalam array imports
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}