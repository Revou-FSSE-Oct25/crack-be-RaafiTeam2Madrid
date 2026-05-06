import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArchivesService } from './archives.service';

@Controller('archives')
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  // 👇 PERBAIKAN DI SINI: Tambahkan FileInterceptor untuk menangkap FormData
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Menyimpan otomatis ke folder uploads
      filename: (req, file, cb) => {
        // Membuat nama file unik (gabungan angka random) agar file tidak tertimpa
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  create(
    @Body() createArchiveDto: any, 
    @UploadedFile() file: any, // Tangkap file PDF yang dikirim
    @Req() req: any
  ) {
    const user = req.user || { name: 'Sistem Pusat', role: 'SYSTEM' }; 
    
    // Jika ada PDF yang sukses diunggah, sisipkan nama file-nya ke dalam database
    if (file) {
      createArchiveDto.fileUrl = file.filename;
    }

    return this.archivesService.create(createArchiveDto, user);
  }

  @Get()
  findAll() {
    return this.archivesService.findAll();
  }

  @Get('search')
  searchArchives(
    @Query('q') query: string, 
    @Query('category') category: string
  ) {
    return this.archivesService.search(query, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveDto: any, @Req() req: any) {
    const user = req.user || { name: 'Sistem Pusat', role: 'SYSTEM' };
    return this.archivesService.update(id, updateArchiveDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user || { name: 'Sistem Pusat', role: 'SYSTEM' };
    return this.archivesService.remove(id, user);
  }
}