import { RagService } from '../../infrastructure/services/rag.service';
export declare class RagController {
    private readonly ragService;
    constructor(ragService: RagService);
    respond(prompt: string): Promise<{
        answer: string;
    }>;
}
