import { Repository } from 'typeorm';
import { InfluencerEntity } from '../../domain/entities/influencer.entity';
export declare class InfluencerRepository {
    private readonly repo;
    constructor(repo: Repository<InfluencerEntity>);
    create(data: Partial<InfluencerEntity>): Promise<InfluencerEntity>;
    findAll(): Promise<InfluencerEntity[]>;
    findById(id: string): Promise<InfluencerEntity | null>;
}
