import { Request } from 'express';
import { UserService } from '../../infrastructure/services/user.service';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { ContentService } from '../../infrastructure/services/content.service';
import { AudioCompleteDto } from '../dto/audio-complete.dto';
import { ContentUseCase } from '../../application/use-cases/content.use-case';
export declare class AudioController {
    private readonly userService;
    private readonly mediaBridgeService;
    private readonly contentService;
    private readonly contentUseCase;
    constructor(userService: UserService, mediaBridgeService: MediaBridgeService, contentService: ContentService, contentUseCase: ContentUseCase);
    generateAudio(dto: any, req: Request): Promise<{
        message: string;
        script: any;
        audioUrl: any;
        duration: any;
        creditsUsed: number;
    }>;
    registerGeneratedAudio(dto: AudioCompleteDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
