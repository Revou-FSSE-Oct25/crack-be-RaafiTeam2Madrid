import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    // Sementara kita bandingkan langsung (plaintext)
    // Di proyek nyata nanti, gunakan library 'bcrypt' untuk keamanan!
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return {
        accessToken: 'TOKEN_RAHASIA_EDRMS_' + Math.random().toString(36).substr(2),
        user: result
      };
    }
    throw new UnauthorizedException('Kredensial salah, silakan cek kembali.');
  }
}