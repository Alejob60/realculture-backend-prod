import { UserEntity } from '../../domain/entities/user.entity';
export declare class Content {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    duration?: number;
    type: 'image' | 'audio' | 'video' | 'text' | 'other';
    createdAt: Date;
    creator?: UserEntity;
    userId?: string;
    status: string;
}
