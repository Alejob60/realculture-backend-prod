import { InfluencerRepository } from '../../infrastructure/database/influencer.repository';
import { InfluencerEntity } from '../../domain/entities/influencer.entity';
export declare class InfluencerController {
    private readonly repo;
    constructor(repo: InfluencerRepository);
    create(body: Partial<InfluencerEntity>): Promise<InfluencerEntity>;
    findAll(): Promise<InfluencerEntity[]>;
    findById(id: string): Promise<InfluencerEntity | null>;
}
