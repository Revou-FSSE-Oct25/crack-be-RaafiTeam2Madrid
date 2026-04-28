import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('auth') // Alamat utamanya jadi http://localhost:3001/auth
export class AppController {
  
  @Post('login') // Sub-alamatnya jadi http://localhost:3001/auth/login
  handleLogin(@Body() body: any) {
    const { email, password } = body;

    // Simulasi pengecekan database sederhana
    // Nantinya ini akan kita ambil dari PostgreSQL
    if (email === 'admin@kearsipan.go.id' && password === 'admin123') {
      return {
        message: 'Login Berhasil!',
        accessToken: 'token-rahasia-dari-backend',
        user: { name: 'Aditya Admin', role: 'SUPER_ADMIN' }
      };
    }

    // Jika salah, kasih tau satpam frontend
    throw new UnauthorizedException('Email atau password salah, Mas!');
  }
}