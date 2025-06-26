import { AiService } from '../../infrastructure/services/ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generatePromo(prompt: string): Promise<{
        result: string;
    }>;
}
