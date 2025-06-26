import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
export declare class MediaBridgeService {
    private readonly httpService;
    private readonly logger;
    private readonly generatorUrl;
    private readonly VIDEO_SERVICE_URL;
    constructor(httpService: HttpService);
    private buildHeaders;
    generatePromoImage(data: {
        prompt: string;
        plan: string;
        textOverlay?: string;
    }): Promise<any>;
    generateVideo(data: any, token?: string): Promise<any>;
    generateVoice(data: any, token?: string): Promise<any>;
    generateMusic(data: any, token?: string): Promise<any>;
    generateAgent(data: any, token?: string): Promise<any>;
    generateSubtitles(data: any, token?: string): Promise<any>;
    generateAvatar(data: any, token?: string): Promise<any>;
    generateCampaign(data: any, token?: string): Promise<any>;
    fetchAudioFile(filename: string): Promise<Buffer>;
    forward(endpoint: string, req: Request, payload: any): Promise<any>;
}
