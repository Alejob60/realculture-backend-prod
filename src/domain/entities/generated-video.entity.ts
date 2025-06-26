import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('generated_videos')
export class GeneratedVideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.generatedVideos)
  user: UserEntity;

  @Column()
  videoUrl: string;

  @Column({ nullable: true })
  prompt: string; // Prompt mejorado para video

  @Column({ nullable: true })
  filename: string; // Nombre en Azure Blob

  @Column({ nullable: true, type: 'int' })
  duration: number; // En segundos (para créditos)

  @Column({ default: 'processing' })
  status: string; // 'processing' | 'ready' | 'failed'

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Expiración por plan

  @CreateDateColumn()
  createdAt: Date;
}
