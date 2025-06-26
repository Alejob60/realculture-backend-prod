import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
export declare class UserRepository {
    private readonly repo;
    constructor(repo: Repository<UserEntity>);
    create(user: Partial<UserEntity>): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    save(user: Partial<UserEntity>): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findAllByRole(role: UserRole): Promise<UserEntity[]>;
    findById(userId: string): Promise<UserEntity | null>;
}
