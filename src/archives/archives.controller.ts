import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ArchivesService } from './archives.service';

@Controller('archives')
export class ArchivesController {
  constructor(private readonly archivesService: ArchivesService) {}

  @Post()
  create(@Body() createArchiveDto: any, @Req() req: any) {
    const user = req.user || { name: 'Sistem Pusat', role: 'SYSTEM' }; 
    return this.archivesService.create(createArchiveDto, user);
  }

  @Get()
  findAll() {
    return this.archivesService.findAll();
  }

  // WAJIB DI SINI: Rute Search HARUS DI ATAS rute :id
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