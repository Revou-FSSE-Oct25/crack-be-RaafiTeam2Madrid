import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  create(
    @Body() createArchiveDto: any, 
    @UploadedFile() file: any,
    @Req() req: any
  ) {
    const user = req.user || { name: 'Aditya Raafi Yudhatama (2026)', role: 'ADMIN' }; 
    
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

  @Get('destroyed')
  findDestroyedArchives() {
    return this.archivesService.findDestroyed();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveDto: any, @Req() req: any) {
    const user = req.user || { name: 'Aditya Raafi Yudhatama (2026)', role: 'ADMIN' };
    return this.archivesService.update(id, updateArchiveDto, user);
  }

  // FITUR BARU: Endpoint API untuk Legal Hold
  @Patch(':id/legal-hold')
  toggleLegalHold(
    @Param('id') id: string, 
    @Body() body: { isLegalHold: boolean, reason: string }, 
    @Req() req: any
  ) {
    const user = req.user || { name: 'Aditya Raafi Yudhatama (2026)', role: 'ADMIN' };
    return this.archivesService.toggleLegalHold(id, body.isLegalHold, body.reason, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user || { name: 'Aditya Raafi Yudhatama (2026)', role: 'ADMIN' };
    return this.archivesService.remove(id, user);
  }
}