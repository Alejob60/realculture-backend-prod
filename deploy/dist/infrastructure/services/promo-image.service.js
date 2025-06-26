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
var PromoImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../domain/entities/user.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const path = require("path");
let PromoImageService = PromoImageService_1 = class PromoImageService {
    userRepository;
    httpService;
    logger = new common_1.Logger(PromoImageService_1.name);
    constructor(userRepository, httpService) {
        this.userRepository = userRepository;
        this.httpService = httpService;
    }
    async generatePromoImage(userId, prompt) {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user)
            throw new common_1.ForbiddenException('Usuario no encontrado');
        const isFree = user.plan === 'FREE';
        const cost = 10;
        if (isFree && user.credits < cost) {
            throw new common_1.ForbiddenException('No tienes suficientes créditos');
        }
        if (isFree) {
            user.credits -= cost;
            await this.userRepository.save(user);
        }
        const microserviceURL = 'http://localhost:4000/image/promo';
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(microserviceURL, { prompt }));
        const data = response.data;
        const imageUrl = data.imageUrl;
        const improvedPrompt = data.prompt || prompt;
        const filename = path.basename(imageUrl);
        return {
            status: 'ok',
            usedCredits: isFree ? cost : 0,
            prompt: improvedPrompt,
            imageUrl,
            filename,
        };
    }
};
exports.PromoImageService = PromoImageService;
exports.PromoImageService = PromoImageService = PromoImageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], PromoImageService);
//# sourceMappingURL=promo-image.service.js.map