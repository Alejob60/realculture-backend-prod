import { RagService } from '../../infrastructure/services/rag.service';
export declare class GenerateRagResponseUseCase {
    private readonly ragService;
    constructor(ragService: RagService);
    execute(prompt: string): Promise<string>;
}
