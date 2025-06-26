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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const generated_image_service_1 = require("../../infrastructure/services/generated-image.service");
let GalleryController = class GalleryController {
    generatedImageService;
    constructor(generatedImageService) {
        this.generatedImageService = generatedImageService;
    }
    async saveImage(req, body) {
        const userId = req.user?.['userId'];
        if (!userId) {
            throw new common_1.BadRequestException('No se pudo obtener el userId del token');
        }
        const filename = `image_${Date.now()}.jpg`;
        return this.generatedImageService.saveImage(userId, body.prompt, body.imageUrl, filename, 'FREE');
    }
    async getUserImages(req) {
        const userId = req.user?.['userId'];
        if (!userId) {
            throw new common_1.BadRequestException('No se pudo obtener el userId del token');
        }
        return this.generatedImageService.getImagesByUserId(userId);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Post)('save-image'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "saveImage", null);
__decorate([
    (0, common_1.Get)('my-images'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getUserImages", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('gallery'),
    __metadata("design:paramtypes", [generated_image_service_1.GeneratedImageService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map