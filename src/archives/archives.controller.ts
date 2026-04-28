import { Controller, Get, Post, Body, Delete, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArchivesService } from './archives.service';

@Controller('archives')
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFile() file: any, @Body() body: any) {
    const archiveData = {
      ...body,
      fileUrl: file ? file.filename : null,
    };
    return this.archivesService.create(archiveData);
  }

  @Get()
  findAll() {
    return this.archivesService.findAll();
  }

  // --- PINTU PENCARIAN ---
  @Get('search')
  search(@Query('q') q: string, @Query('category') category: string) {
    return this.archivesService.search(q || '', category);
  }

  // --- PINTU PENYUSUTAN JRA ---
  @Get('disposal')
  getDisposal() {
    return this.archivesService.getDisposalSchedule();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivesService.remove(id);
  }
}