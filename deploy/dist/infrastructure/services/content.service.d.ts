import { ContentRepository } from '../database/content.repository';
import { Content } from '../../domain/entities/content.entity';
import { UserRepository } from '../database/user.repository';
export declare class ContentService {
    private readonly contentRepository;
    private readonly userRepository;
    constructor(contentRepository: ContentRepository, userRepository: UserRepository);
    create(contentData: Partial<Content>): Promise<Content>;
    findAll(): Promise<Content[]>;
    findOne(id: string): Promise<Content>;
    update(id: string, updateData: Partial<Content>): Promise<Content>;
    remove(id: string): Promise<void>;
    saveAudioToGallery(params: {
        userId: string;
        script: string;
        mediaUrl: string;
    }): Promise<Content>;
    save(data: {
        userId: string;
        type: 'image' | 'audio' | 'video' | 'text' | 'other';
        prompt: string;
        url: string;
        duration?: number;
        status: string;
        createdAt: Date;
    }): Promise<void>;
}
