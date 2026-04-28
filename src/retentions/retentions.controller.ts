import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { RetentionsService } from './retentions.service';
import { Retention } from './retention.entity';

@Controller('retentions')
export class RetentionsController {
  constructor(private readonly retentionsService: RetentionsService) {}

  @Get()
  findAll() {
    return this.retentionsService.findAll();
  }

  // PINTU INI YANG DIPANGGIL OLEH FORMULIR TADI
  @Post()
  create(@Body() data: Partial<Retention>) {
    return this.retentionsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retentionsService.remove(id);
  }
}