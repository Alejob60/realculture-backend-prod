import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { HttpService } from '@nestjs/axios';
export declare class PromoImageService {
    private readonly userRepository;
    private readonly httpService;
    private readonly logger;
    constructor(userRepository: Repository<UserEntity>, httpService: HttpService);
    generatePromoImage(userId: string, prompt: string): Promise<{
        status: string;
        usedCredits: number;
        prompt: any;
        imageUrl: any;
        filename: string;
    }>;
}
