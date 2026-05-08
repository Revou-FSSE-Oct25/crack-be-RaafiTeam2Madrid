import { Test, TestingModule } from '@nestjs/testing';
import { AccessRequestsService } from './access-requests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessRequest } from './access-request.entity';

describe('AccessRequestsService Unit Tests', () => {
  let service: AccessRequestsService;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((req) =>
        Promise.resolve({ id: 'req-1', ...req, status: 'PENDING' }),
      ),
    update: jest.fn().mockResolvedValue(true),
    findOne: jest
      .fn()
      .mockResolvedValue({
        id: 'req-1',
        status: 'PENDING',
        staffName: 'Akun Staf',
      }),
    findOneBy: jest
      .fn()
      .mockResolvedValue({
        id: 'req-1',
        status: 'APPROVED',
        staffName: 'Akun Staf',
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessRequestsService,
        {
          provide: getRepositoryToken(AccessRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccessRequestsService>(AccessRequestsService);
  });

  it('1. Harus berhasil membuat tiket pengajuan akses baru (PENDING)', async () => {
    const dto = {
      archiveId: '123',
      archiveTitle: 'Draft Awal',
      staffName: 'Staf Magang',
      reason: 'Riset',
    };
    const result = await service.create(dto);
    expect(result).toEqual({ id: 'req-1', ...dto, status: 'PENDING' });
  });

  it('2. Admin harus bisa mengubah status tiket menjadi APPROVED', async () => {
    await service.updateStatus('req-1', 'APPROVED');
    expect(mockRepository.update).toHaveBeenCalledWith('req-1', {
      status: 'APPROVED',
    });
  });
});
