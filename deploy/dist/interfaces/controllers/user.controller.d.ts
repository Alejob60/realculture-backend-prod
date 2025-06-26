import { RequestWithUser } from 'src/types/request-with-user';
import { GeneratedImageService } from '../../infrastructure/services/generated-image.service';
import { UserService } from 'src/infrastructure/services/user.service';
export declare class UserController {
    private readonly userService;
    private readonly imageService;
    constructor(userService: UserService, imageService: GeneratedImageService);
    getCredits(req: RequestWithUser): Promise<{
        credits: number;
    }>;
    getProfile(req: RequestWithUser): Promise<import("../../domain/entities/user.entity").UserEntity | null>;
    getUserImages(req: RequestWithUser): Promise<{
        id: string;
        prompt: string;
        createdAt: Date;
        expiresAt: Date;
        url: string;
    }[]>;
    setCredits(req: RequestWithUser, body: {
        credits: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    decrementCredits(req: RequestWithUser, body: {
        amount: number;
    }): Promise<{
        message: string;
        credits: number;
    }>;
    upgradePlan(req: RequestWithUser, body: {
        newPlan: 'CREATOR' | 'PRO';
    }): Promise<{
        message: string;
        plan: import("../../domain/enums/user-role.enum").UserRole;
        credits: number;
    }>;
}
