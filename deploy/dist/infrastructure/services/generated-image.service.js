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
exports.GeneratedImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generated_image_entity_1 = require("../../domain/entities/generated-image.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
const azure_blob_services_1 = require("../services/azure-blob.services");
let GeneratedImageService = class GeneratedImageService {
    repo;
    userRepo;
    azureBlobService;
    constructor(repo, userRepo, azureBlobService) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.azureBlobService = azureBlobService;
    }
    async saveImage(userId, prompt, imageUrl, filename, plan) {
        const user = await this.userRepo.findOne({ where: { userId } });
        if (!user)
            throw new Error('Usuario no encontrado');
        const expiresAt = new Date();
        if (plan === 'FREE') {
            expiresAt.setHours(expiresAt.getHours() + 24);
        }
        else {
            expiresAt.setDate(expiresAt.getDate() + 30);
        }
        const image = this.repo.create({
            user,
            prompt,
            imageUrl,
            filename,
            createdAt: new Date(),
            expiresAt,
        });
        await this.repo.save(image);
        return {
            success: true,
            message: '✅ Imagen guardada en la galería',
            expiresAt,
        };
    }
    async getImagesByUserId(userId) {
        const user = await this.userRepo.findOne({ where: { userId } });
        if (!user)
            throw new Error('Usuario no encontrado');
        const now = new Date();
        const images = await this.repo.find({
            where: {
                user,
                expiresAt: (0, typeorm_2.MoreThan)(now),
            },
            order: { createdAt: 'DESC' },
        });
        const result = await Promise.all(images.map(async (img) => {
            const signedUrl = await this.azureBlobService.getSignedUrl(img.filename, 24 * 60 * 60);
            return {
                id: img.id,
                prompt: img.prompt,
                createdAt: img.createdAt,
                expiresAt: img.expiresAt,
                url: signedUrl,
            };
        }));
        return result;
    }
    async deleteExpiredImages() {
        const now = new Date();
        const expiredImages = await this.repo.find({
            where: { expiresAt: (0, typeorm_2.LessThan)(now) },
        });
        if (expiredImages.length > 0) {
            await this.repo.remove(expiredImages);
        }
    }
};
exports.GeneratedImageService = GeneratedImageService;
exports.GeneratedImageService = GeneratedImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(generated_image_entity_1.GeneratedImageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        azure_blob_services_1.AzureBlobService])
], GeneratedImageService);
//# sourceMappingURL=generated-image.service.js.map