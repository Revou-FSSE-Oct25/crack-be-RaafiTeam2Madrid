import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { RetentionsService } from './retentions.service';
import { Retention } from './retention.entity';

@Controller('retentions')
export class RetentionsController {
  constructor(private readonly retentionsService: RetentionsService) {}

  @Get()
  async findAll() {
    // 1. Ambil data asli dari Service/Database
    const rawData = await this.retentionsService.findAll();

    // 2. Terjemahkan agar sesuai dengan "selera" Frontend
    return rawData.map((item) => ({
      id: item.id,
      code: item.code || `JRA-${item.id.substring(0, 4).toUpperCase()}`, // Jaga-jaga jika code di DBeaver kosong
      category: item.seriesName, // Ubah seriesName menjadi category
      activeYears: item.activeYears,
      inactiveYears: item.inactiveYears,
      finalAction: item.finalAction,
      description: `Aturan retensi untuk ${item.seriesName}`, // Buat deskripsi otomatis agar UI cantik
    }));
  }

  // PINTU INI YANG DIPANGGIL OLEH FORMULIR TADI (TAMBAH DATA BARU)
  @Post()
  create(@Body() data: Partial<Retention>) {
    return this.retentionsService.create(data);
  }

  // --- TAMBAHAN: Pintu untuk proses EDIT (UPDATE) data yang sudah ada ---
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Retention>) {
    return this.retentionsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retentionsService.remove(id);
  }
}
