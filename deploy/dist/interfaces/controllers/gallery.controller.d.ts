import { Request } from 'express';
import { GeneratedImageService } from '../../infrastructure/services/generated-image.service';
export declare class GalleryController {
    private readonly generatedImageService;
    constructor(generatedImageService: GeneratedImageService);
    saveImage(req: Request, body: {
        prompt: string;
        imageUrl: string;
    }): Promise<{
        success: boolean;
        message: string;
        expiresAt: Date;
    }>;
    getUserImages(req: Request): Promise<{
        id: string;
        prompt: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
    }[]>;
}
