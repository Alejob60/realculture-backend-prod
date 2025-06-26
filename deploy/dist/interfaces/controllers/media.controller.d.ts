import { Request, Response } from 'express';
import { UseServiceUseCase } from '../../application/use-cases/use-service.use-case';
import { UserService } from '../../infrastructure/services/user.service';
import { GeneratedImageService } from '../../infrastructure/services/generated-image.service';
import { HttpService } from '@nestjs/axios';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { AzureBlobService } from '../../infrastructure/services/azure-blob.services';
export declare class MediaController {
    private readonly useService;
    private readonly mediaBridgeService;
    private readonly userService;
    private readonly imageService;
    private readonly httpService;
    private readonly azureBlobService;
    private readonly logger;
    constructor(useService: UseServiceUseCase, mediaBridgeService: MediaBridgeService, userService: UserService, imageService: GeneratedImageService, httpService: HttpService, azureBlobService: AzureBlobService);
    private extractUserData;
    generate(type: string, req: Request, body: any): Promise<{
        success: boolean;
        message: string;
        result: any;
        credits: number;
    }>;
    getImages(req: Request): Promise<{
        success: boolean;
        result: {
            id: string;
            prompt: string;
            createdAt: Date;
            expiresAt: Date;
            url: string;
        }[];
    }>;
    proxyImage(url: string, res: Response): Promise<void>;
    serveAudio(filename: string, res: Response): Promise<void>;
    getSignedImageUrl(filename: string): Promise<{
        url: string;
    }>;
    getMyImages(req: Request): Promise<{
        id: string;
        prompt: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
    }[]>;
}
