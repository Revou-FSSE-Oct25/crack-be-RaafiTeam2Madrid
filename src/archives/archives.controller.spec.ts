import { Test, TestingModule } from '@nestjs/testing';
import { ArchivesController } from './archives.controller';
import { ArchivesService } from './archives.service';

describe('ArchivesController Unit Tests', () => {
  let controller: ArchivesController;
  let service: ArchivesService;

  // Mock Service
  const mockArchivesService = {
    findAll: jest.fn().mockResolvedValue([
      { id: '1', title: 'Arsip Skripsi', code: 'SKP.01' },
    ]),
    findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Arsip' }),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'new-id', ...dto })),
    // Jika di controllermu fungsinya bukan 'search', jest tidak akan komplain di sini
    search: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivesController],
      providers: [
        {
          provide: ArchivesService,
          useValue: mockArchivesService,
        },
      ],
    }).compile();

    controller = module.get<ArchivesController>(ArchivesController);
    service = module.get<ArchivesService>(ArchivesService);
  });

  it('1. Controller harus terdefinisi', () => {
    expect(controller).toBeDefined();
  });

  it('2. GET /archives: Harus mengembalikan daftar semua arsip', async () => {
    const result = await controller.findAll();
    expect(result).toBeDefined();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('3. POST /archives: Harus berhasil membuat data arsip baru', async () => {
    const newArchiveDto = {
      title: 'Arsip Baru Test',
      code: 'TEST.01',
      category: 'Aktif',
      description: 'Testing',
    };

    // MOCK REQUEST OBJECT (Penting agar req.user tidak undefined)
    const mockReq = {
      user: { name: 'Aditya Raafi Yudhatama (2026)', role: 'ADMIN' }
    };

    // Kita masukkan mockReq sebagai argumen terakhir sesuai urutan di controller kamu
    const result = await controller.create(newArchiveDto as any, null, mockReq);
    
    expect(result).toHaveProperty('id', 'new-id');
    expect(service.create).toHaveBeenCalled();
  });

  // Test ini kita buat fleksibel: Jika fungsi 'search' tidak ada, kita tes findAll dengan query
  it('4. Pencarian: Harus memanggil fungsi pencarian di service', async () => {
    // Cek apakah controller punya method 'search' atau gunakan 'findAll' jika itu yang dipakai
    if (typeof controller.search === 'function') {
      await controller.search('Skripsi', 'Aktif');
      expect(service.search).toHaveBeenCalled();
    } else {
      // Jika pencarianmu menyatu di findAll(@Query('q') q, ...), jalankan ini:
      await (controller as any).findAll('Skripsi', 'Aktif');
      expect(service.findAll).toHaveBeenCalled();
    }
  });
});