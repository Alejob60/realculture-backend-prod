import { Repository } from 'typeorm';
import { GeneratedImageEntity } from '../../domain/entities/generated-image.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { AzureBlobService } from '../services/azure-blob.services';
export declare class GeneratedImageService {
    private readonly repo;
    private readonly userRepo;
    private readonly azureBlobService;
    constructor(repo: Repository<GeneratedImageEntity>, userRepo: Repository<UserEntity>, azureBlobService: AzureBlobService);
    saveImage(userId: string, prompt: string, imageUrl: string, filename: string, plan: string): Promise<{
        success: boolean;
        message: string;
        expiresAt: Date;
    }>;
    getImagesByUserId(userId: string): Promise<{
        id: string;
        prompt: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
    }[]>;
    deleteExpiredImages(): Promise<void>;
}
