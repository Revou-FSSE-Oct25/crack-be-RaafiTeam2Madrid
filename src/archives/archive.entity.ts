import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column({ type: 'timestamp', nullable: true })
  retentionDate: Date;

  @CreateDateColumn()
  uploadDate: Date;

  // --- FITUR SOFT DELETE ---
  @Column({ default: false })
  isDestroyed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  destroyedAt: Date;

  @Column({ nullable: true })
  destroyedBy: string;

  // --- FITUR LEGAL HOLD (PEMBEKUAN HUKUM) ---
  @Column({ default: false })
  isLegalHold: boolean;

  @Column({ type: 'text', nullable: true })
  legalHoldReason: string | null;
}