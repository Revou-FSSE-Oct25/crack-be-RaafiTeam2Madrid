import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('access_requests')
export class AccessRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  archiveId: string; // ID Arsip yang diminta

  @Column()
  archiveTitle: string; // Judul Arsip (agar mudah dibaca Admin)

  @Column()
  staffName: string; // Nama staf yang meminta

  @Column()
  reason: string; // Alasan mengapa staf butuh arsip ini

  @Column({ default: 'PENDING' }) // Status: PENDING, APPROVED, REJECTED
  status: string;

  @CreateDateColumn()
  requestDate: Date;
}