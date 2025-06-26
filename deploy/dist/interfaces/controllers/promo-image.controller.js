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
exports.PromoImageController = void 0;
const common_1 = require("@nestjs/common");
const media_bridge_service_1 = require("../../infrastructure/services/media-bridge.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_service_1 = require("../../infrastructure/services/user.service");
const PLAN_CREDITS = {
    'promo-image': {
        FREE: 10,
        CREATOR: 15,
        PRO: 10,
    },
};
let PromoImageController = class PromoImageController {
    mediaBridge;
    userService;
    constructor(mediaBridge, userService) {
        this.mediaBridge = mediaBridge;
        this.userService = userService;
    }
    async generatePromoImage(body, req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const userId = req.user?.userId;
        if (!token || !userId) {
            throw new common_1.HttpException('Token inválido o usuario no identificado', common_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findById(userId);
        const userPlan = user?.role || 'FREE';
        const serviceKey = 'promo-image';
        const requiredCredits = PLAN_CREDITS[serviceKey]?.[userPlan] ?? null;
        if (requiredCredits === null) {
            throw new common_1.HttpException('Tu plan no permite generar imágenes promocionales', common_1.HttpStatus.FORBIDDEN);
        }
        if (!user || user.credits < requiredCredits) {
            throw new common_1.HttpException('Créditos insuficientes', common_1.HttpStatus.FORBIDDEN);
        }
        const result = await this.mediaBridge.generatePromoImage(body);
        const updatedUser = await this.userService.decrementCredits(userId, 10);
        if (!updatedUser) {
            throw new common_1.NotFoundException('No se pudo actualizar los créditos del usuario');
        }
        return {
            ...(result || {}),
            credits: updatedUser.credits,
        };
    }
};
exports.PromoImageController = PromoImageController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PromoImageController.prototype, "generatePromoImage", null);
exports.PromoImageController = PromoImageController = __decorate([
    (0, common_1.Controller)('api/promo-image'),
    __metadata("design:paramtypes", [media_bridge_service_1.MediaBridgeService,
        user_service_1.UserService])
], PromoImageController);
//# sourceMappingURL=promo-image.controller.js.map