import { Test, TestingModule } from '@nestjs/testing';
import { ArchivesService } from './archives.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Archive } from './archive.entity';
import { BadRequestException } from '@nestjs/common';

describe('ArchivesService Unit Tests', () => {
  let service: ArchivesService;

  // Membuat tiruan (mock) dari Database agar tidak mengganggu data asli
  const mockArchivesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchivesService,
        {
          provide: getRepositoryToken(Archive),
          useValue: mockArchivesRepository,
        },
      ],
    }).compile();

    service = module.get<ArchivesService>(ArchivesService);
  });

  it('1. Sistem (Service) harus terdefinisi dengan baik', () => {
    expect(service).toBeDefined();
  });

  it('2. PROTEKSI HUKUM: Harus menolak pemusnahan jika arsip sedang Legal Hold', async () => {
    // Skenario: Menemukan arsip yang sedang dibekukan
    const mockFrozenArchive = {
      id: '123',
      title: 'Dokumen Rahasia Negara',
      isLegalHold: true,
      legalHoldReason: 'Audit BPK',
    };

    mockArchivesRepository.findOne.mockResolvedValue(mockFrozenArchive);

    const mockUser = { name: 'Aditya Raafi Yudhatama (2026)' };

    // Eksekusi & Ekspektasi: Harus melemparkan BadRequestException
    await expect(service.remove('123', mockUser)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.remove('123', mockUser)).rejects.toThrow(
      'Akses Ditolak: Arsip ini sedang dalam status Legal Hold (Dibekukan) dan dilindungi oleh sistem dari pemusnahan.',
    );
  });

  it('3. SOFT DELETE: Harus memusnahkan arsip dengan aman jika tidak ada Legal Hold', async () => {
    // Skenario: Arsip biasa tanpa gembok
    const mockNormalArchive = {
      id: '456',
      title: 'Brosur Lama',
      isLegalHold: false,
    };

    mockArchivesRepository.findOne.mockResolvedValue(mockNormalArchive);
    mockArchivesRepository.update.mockResolvedValue(true);

    const mockUser = { name: 'Admin EDRMS' };

    // Eksekusi
    const result = await service.remove('456', mockUser);

    // Ekspektasi
    expect(result.message).toEqual('Arsip berhasil dimusnahkan secara logis');
    expect(mockArchivesRepository.update).toHaveBeenCalledWith(
      '456',
      expect.objectContaining({
        isDestroyed: true,
        destroyedBy: 'Admin EDRMS',
      }),
    );
  });
});
