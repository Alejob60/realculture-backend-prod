import { ContentService } from '../../infrastructure/services/content.service';
import { Content } from '../../domain/entities/content.entity';
import { Request } from 'express';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    create(body: Partial<Content>, req: Request): Promise<Content>;
    findAll(): Promise<Content[]>;
    findById(id: string): Promise<Content>;
    update(id: string, updateData: Partial<Content>): Promise<Content>;
    delete(id: string): Promise<void>;
}
