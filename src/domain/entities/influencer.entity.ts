import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('influencers')
export class InfluencerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  personality: string;

  @Column()
  style: string;

  @Column({ nullable: true })
  avatarUrl: string; // URL de la imagen del influencer (IA o subida)

  @Column({ default: 'USER' })
  type: 'OFFICIAL' | 'USER'; // Quien lo creó: 'USER' o 'OFFICIAL'

  @Column({ nullable: true })
  demoVideoUrl: string; // Video con presentación/avatar IA hablando

  @Column({ type: 'json', nullable: true })
  stats: {
    engagement: number;
    likes?: number;
    views?: number;
    conversions?: number;
  }; // Se puede expandir con más datos IA

  @OneToMany(() => Product, (product) => product.influencer)
  products: Product[];

  @Column({ nullable: true })
  creatorUserId: string; // opcional: si quieres relacionarlo con un usuario
}
