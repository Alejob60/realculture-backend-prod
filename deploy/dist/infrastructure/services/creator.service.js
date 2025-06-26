"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const user_repository_1 = require("../../infrastructure/database/user.repository");
const user_role_enum_1 = require("../../domain/enums/user-role.enum");
let CreatorService = class CreatorService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = await this.userRepository.save({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: user_role_enum_1.UserRole.CREATOR,
        });
        return newUser;
    }
    async findAll() {
        return this.userRepository.findAllByRole(user_role_enum_1.UserRole.CREATOR);
    }
};
exports.CreatorService = CreatorService;
exports.CreatorService = CreatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], CreatorService);
//# sourceMappingURL=creator.service.js.map