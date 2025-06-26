import { CreatorService } from '../../infrastructure/services/creator.service';
import { CreateCreatorDto } from '../dto/create-creator.dto';
export declare class CreatorController {
    private readonly creatorService;
    constructor(creatorService: CreatorService);
    create(dto: CreateCreatorDto): Promise<import("../../domain/entities/user.entity").UserEntity>;
    findAll(): Promise<import("../../domain/entities/user.entity").UserEntity[]>;
}
