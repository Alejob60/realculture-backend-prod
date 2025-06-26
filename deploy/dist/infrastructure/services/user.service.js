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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../domain/entities/user.entity");
const PLAN_CREDITS = {
    'promo-image': {
        FREE: 10,
        CREATOR: 15,
        PRO: 10,
    },
    'promo-video': {
        FREE: 25,
        CREATOR: 25,
        PRO: 15,
    },
    audio: {
        FREE: 5,
        CREATOR: 5,
        PRO: 0,
    },
    subtitles: {
        FREE: 10,
        CREATOR: 10,
        PRO: 5,
    },
    'ai-agent': {
        FREE: null,
        CREATOR: 150,
        PRO: 150,
    },
    'campaign-automation': {
        FREE: null,
        CREATOR: 40,
        PRO: 20,
    },
    avatar: {
        FREE: null,
        CREATOR: null,
        PRO: 150,
    },
};
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getCredits(userId) {
        const user = await this.userRepository.findOneBy({ userId: userId });
        return { credits: user?.credits ?? 0 };
    }
    async findById(userId) {
        return await this.userRepository.findOneBy({ userId: userId });
    }
    async upgradePlan(userId, newPlan) {
        const user = await this.userRepository.findOneBy({ userId: userId });
        if (!user)
            throw new Error('Usuario no encontrado');
        const planCredits = {
            CREATOR: 150,
            PRO: 1100,
        };
        const creditsToAdd = planCredits[newPlan];
        user.role = newPlan;
        user.credits += creditsToAdd;
        await this.userRepository.save(user);
        return {
            message: 'Plan actualizado correctamente',
            newCredits: user.credits,
            plan: user.role,
        };
    }
    async save(user) {
        await this.userRepository.save(user);
    }
    async setCredits(userId, credits) {
        await this.userRepository.update({ userId: userId }, { credits });
    }
    async decrementCredits(userId, amount) {
        const user = await this.userRepository.findOne({
            where: { userId: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (user.credits < amount) {
            throw new common_1.BadRequestException('No tienes créditos suficientes');
        }
        user.credits -= amount;
        return this.userRepository.save(user);
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async create(data) {
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map