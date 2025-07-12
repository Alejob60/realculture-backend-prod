// src/domain/entities/content.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  mediaUrl: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ default: 'other' })
  type: 'image' | 'audio' | 'video' | 'text' | 'other';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.contents)
  creator?: UserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ default: 'completed' })
  status: string;

  @Column({ nullable: true })
  prompt?: string;

  @Column({ nullable: true })
  filename?: string;

  // ✅ Campos nuevos necesarios:
  @Column({ nullable: true })
  url?: string;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  metadata?: string;
}
