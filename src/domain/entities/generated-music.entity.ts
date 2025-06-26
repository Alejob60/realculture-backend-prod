import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('generated_music')
export class GeneratedMusicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.generatedMusic)
  user: UserEntity;

  @Column()
  musicUrl: string;

  @Column({ nullable: true })
  prompt: string; // Prompt generado por IA

  @Column({ nullable: true })
  genre: string; // Opcional: electrónica, clásica, lofi, etc.

  @Column({ nullable: true })
  filename: string; // Para Azure Blob

  @Column({ nullable: true, type: 'int' })
  duration: number; // En segundos, útil para créditos

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Según plan: 24h / 30d

  @CreateDateColumn()
  createdAt: Date;
}
