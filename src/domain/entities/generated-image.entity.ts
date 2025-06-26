import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('generated_images')
export class GeneratedImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prompt: string; // Prompt mejorado usado para generar la imagen

  @Column({ nullable: true })
  imageUrl: string; // URL final con SAS token o pública

  @Column({ nullable: true })
  filename: string; // Nombre en Azure Blob

  @Column({ default: 'active' })
  status: string; // 'active', 'expired', etc.

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Fecha de expiración por plan

  @Column()
  userId: string; // Para consultas rápidas por FK

  @ManyToOne(() => UserEntity, (user) => user.generatedImages)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
