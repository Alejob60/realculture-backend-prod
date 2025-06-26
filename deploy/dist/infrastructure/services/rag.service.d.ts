export declare class RagService {
    private readonly logger;
    fetchContextFromAzureSearch(prompt: string): Promise<string>;
    generateWithOpenAI(prompt: string): Promise<string>;
}
