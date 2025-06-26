import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('generated_audios')
export class GeneratedAudioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.generatedAudios)
  user: UserEntity;

  @Column()
  audioUrl: string;

  @Column({ nullable: true })
  prompt: string;

  @Column({ nullable: true })
  script: string; // ✅ Se agrega el texto completo usado para TTS

  @Column({ nullable: true })
  filename: string; // ✅ Nombre del archivo en Azure Blob

  @Column({ nullable: true, type: 'int' })
  duration: number; // ✅ Duración en segundos (para cobro por créditos)

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date; // ✅ Soporte para expiración por plan

  @CreateDateColumn()
  createdAt: Date;
}
