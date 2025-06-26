import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly configService;
    private readonly apiKey;
    private readonly endpoint;
    private readonly deployment;
    private readonly apiVersion;
    constructor(configService: ConfigService);
    generatePromo(prompt: string): Promise<string>;
}
