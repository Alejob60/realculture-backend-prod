import { UserService } from '../../infrastructure/services/user.service';
export declare class UseServiceUseCase {
    private readonly userService;
    constructor(userService: UserService);
    execute(userId: string, service: 'image' | 'video' | 'tts' | 'subtitles' | 'ai-agent' | 'voice' | 'music' | 'agent'): Promise<number>;
}
