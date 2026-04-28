import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('retentions')
export class Retention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // Contoh: SKP, HM, KP

  @Column()
  seriesName: string;

  @Column({ type: 'int' })
  activeYears: number; // Masa Aktif (Tahun)

  @Column({ type: 'int' })
  inactiveYears: number; // Masa Inaktif (Tahun)

  @Column()
  finalAction: string; // Musnah atau Permanen
}