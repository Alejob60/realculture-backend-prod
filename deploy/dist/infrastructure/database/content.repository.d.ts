import { Repository } from 'typeorm';
import { Content } from '../../domain/entities/content.entity';
export declare class ContentRepository {
    private readonly repo;
    constructor(repo: Repository<Content>);
    create(content: Partial<Content>): Promise<Content>;
    findAll(): Promise<Content[]>;
    findOne(id: string): Promise<Content | null>;
    findByCreator(creatorId: string): Promise<Content[]>;
    update(id: string, updateData: Partial<Content>): Promise<Content>;
    delete(id: string): Promise<void>;
}
