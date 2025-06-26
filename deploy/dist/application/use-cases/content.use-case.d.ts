import { ContentRepository } from '../../infrastructure/database/content.repository';
import { Content } from '../../domain/entities/content.entity';
export declare class ContentUseCase {
    private readonly contentRepository;
    constructor(contentRepository: ContentRepository);
    create(contentData: Partial<Content>): Promise<Content>;
    findAll(): Promise<Content[]>;
    findAllByCreator(creatorId: string): Promise<Content[]>;
    findOne(id: string): Promise<Content>;
    update(id: string, updateData: Partial<Content>): Promise<Content>;
    remove(id: string): Promise<void>;
    registerGeneratedContent(data: {
        userId: string;
        type: string;
        prompt: string;
        url: string;
        duration?: number;
        status: string;
        createdAt: Date;
    }): Promise<Content>;
}
