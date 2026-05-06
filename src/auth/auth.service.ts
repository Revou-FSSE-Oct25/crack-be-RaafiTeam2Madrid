import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private auditLogsService: AuditLogsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && user.password === pass) {
      const { password, ...result } = user;

      // SESUAIKAN DENGAN ENTITY: action, performedBy, details, targetId
      await this.auditLogsService.create({
        action: 'LOGIN',
        performedBy: user.name,
        targetId: user.id, // Menyimpan ID user yang login
        details: `Otorisasi masuk sistem berhasil. Role: ${user.role}`,
      });

      return {
        accessToken:
          'TOKEN_RAHASIA_EDRMS_' + Math.random().toString(36).substr(2),
        user: result,
      };
    }
    throw new UnauthorizedException('Kredensial salah, silakan cek kembali.');
  }

  async logLogout(userName: string, userId: string) {
    await this.auditLogsService.create({
      action: 'LOGOUT',
      performedBy: userName || 'Unknown',
      targetId: userId || 'N/A',
      details: 'Keluar dari sistem (Sesi diakhiri)',
    });
    return { success: true };
  }
}
