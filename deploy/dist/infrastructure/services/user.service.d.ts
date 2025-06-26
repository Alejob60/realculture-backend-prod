import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from 'src/domain/enums/user-role.enum';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    getCredits(userId: string): Promise<{
        credits: number;
    }>;
    findById(userId: string): Promise<UserEntity | null>;
    upgradePlan(userId: string, newPlan: 'CREATOR' | 'PRO'): Promise<{
        message: string;
        newCredits: number;
        plan: UserRole;
    }>;
    save(user: UserEntity): Promise<void>;
    setCredits(userId: string, credits: number): Promise<void>;
    decrementCredits(userId: string, amount: number): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: Partial<UserEntity>): Promise<UserEntity>;
}
