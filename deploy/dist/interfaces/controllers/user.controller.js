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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const generated_image_service_1 = require("../../infrastructure/services/generated-image.service");
const user_service_1 = require("../../infrastructure/services/user.service");
let UserController = class UserController {
    userService;
    imageService;
    constructor(userService, imageService) {
        this.userService = userService;
        this.imageService = imageService;
    }
    async getCredits(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuario no autenticado');
        }
        return this.userService.getCredits(userId);
    }
    async getProfile(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuario no autenticado');
        }
        return this.userService.findById(userId);
    }
    async getUserImages(req) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Usuario no autenticado');
        }
        return this.imageService.getImagesByUserId(userId);
    }
    async setCredits(req, body) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('No autenticado');
        }
        if (typeof body.credits !== 'number' || body.credits < 0) {
            throw new common_1.BadRequestException('Créditos inválidos');
        }
        await this.userService.setCredits(userId, body.credits);
        return {
            success: true,
            message: `✅ Créditos actualizados a ${body.credits}`,
        };
    }
    async decrementCredits(req, body) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('No autenticado');
        }
        if (!body.amount || body.amount <= 0) {
            throw new common_1.BadRequestException('El monto a descontar debe ser mayor que 0');
        }
        const updatedUser = await this.userService.decrementCredits(userId, body.amount);
        return {
            message: `Se descontaron ${body.amount} créditos correctamente.`,
            credits: updatedUser.credits,
        };
    }
    async upgradePlan(req, body) {
        const userId = req.user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('No autenticado');
        }
        const { newPlan } = body;
        if (!['CREATOR', 'PRO'].includes(newPlan)) {
            throw new common_1.BadRequestException('Plan inválido');
        }
        const result = await this.userService.upgradePlan(userId, newPlan);
        return {
            message: '✅ Plan actualizado exitosamente',
            plan: result.plan,
            credits: result.newCredits,
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('credits'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCredits", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('images'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserImages", null);
__decorate([
    (0, common_1.Patch)('admin/set-credits'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setCredits", null);
__decorate([
    (0, common_1.Patch)('decrement-credits'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "decrementCredits", null);
__decorate([
    (0, common_1.Patch)('upgrade'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "upgradePlan", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService,
        generated_image_service_1.GeneratedImageService])
], UserController);
//# sourceMappingURL=user.controller.js.map