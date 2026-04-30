import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('archives')
export class Archive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  fileUrl: string;

  // KOLOM BARU: Menyimpan batas waktu retensi arsip
  @Column({ type: 'date', nullable: true })
  retentionDate: Date;

  @CreateDateColumn()
  uploadDate: Date;
}