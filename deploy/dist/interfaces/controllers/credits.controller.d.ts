import { Repository } from 'typeorm';
import { Request } from 'express';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class CreditsController {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    buyCredits(req: Request, body: {
        amount: number;
    }): Promise<{
        message: string;
        totalCredits: number;
    }>;
    getCredits(req: Request): Promise<{
        credits: number;
    }>;
}
