import { CreateCreatorDto } from '../../interfaces/dto/create-creator.dto';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class CreatorService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(dto: CreateCreatorDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
}
