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
var MediaController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const use_service_use_case_1 = require("../../application/use-cases/use-service.use-case");
const user_service_1 = require("../../infrastructure/services/user.service");
const generated_image_service_1 = require("../../infrastructure/services/generated-image.service");
const axios_1 = require("@nestjs/axios");
const media_bridge_service_1 = require("../../infrastructure/services/media-bridge.service");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const azure_blob_services_1 = require("../../infrastructure/services/azure-blob.services");
let MediaController = MediaController_1 = class MediaController {
    useService;
    mediaBridgeService;
    userService;
    imageService;
    httpService;
    azureBlobService;
    logger = new common_1.Logger(MediaController_1.name);
    constructor(useService, mediaBridgeService, userService, imageService, httpService, azureBlobService) {
        this.useService = useService;
        this.mediaBridgeService = mediaBridgeService;
        this.userService = userService;
        this.imageService = imageService;
        this.httpService = httpService;
        this.azureBlobService = azureBlobService;
    }
    extractUserData(req) {
        const userId = req.user?.['userId'];
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!userId || !token) {
            throw new common_1.UnauthorizedException('Usuario no autenticado o token no encontrado');
        }
        return { userId, token };
    }
    async generate(type, req, body) {
        const { userId, token } = this.extractUserData(req);
        const typeMap = {
            image: 'image',
            video: 'video',
            voice: 'voice',
            music: 'music',
            agent: 'ai-agent',
        };
        const usageKey = typeMap[type];
        if (!usageKey) {
            throw new common_1.BadRequestException(`Tipo de contenido no soportado: ${type}`);
        }
        await this.useService.execute(userId, usageKey);
        const serviceMap = {
            image: this.mediaBridgeService.generatePromoImage,
            video: this.mediaBridgeService.generateVideo,
            voice: this.mediaBridgeService.generateVoice,
            music: this.mediaBridgeService.generateMusic,
            agent: this.mediaBridgeService.generateAgent,
        };
        const generate = serviceMap[type];
        let result;
        if (type === 'image') {
            const user = await this.userService.findById(userId);
            if (!user || !user.plan) {
                throw new common_1.UnauthorizedException('No se pudo determinar el plan del usuario');
            }
            const plan = user.plan;
            result = await this.mediaBridgeService.generatePromoImage({
                prompt: body.prompt,
                plan,
            });
            const prompt = result?.result?.prompt;
            const imageUrl = result?.result?.imageUrl;
            const filename = result?.result?.filename;
            if (imageUrl && prompt && filename) {
                await this.imageService.saveImage(userId, prompt, imageUrl, filename, plan);
            }
        }
        else {
            result = await generate.call(this.mediaBridgeService, body, token);
        }
        const updatedUser = await this.userService.findById(userId);
        if (!updatedUser) {
            throw new common_1.UnauthorizedException('Usuario no encontrado luego de generar contenido');
        }
        return {
            success: true,
            message: `✅ ${type.toUpperCase()} generado correctamente`,
            result: { ...(result?.result || {}) },
            credits: updatedUser.credits,
        };
    }
    async getImages(req) {
        const userId = req.user.sub;
        const images = await this.imageService.getImagesByUserId(userId);
        return { success: true, result: images };
    }
    async proxyImage(url, res) {
        try {
            const imageResponse = await this.httpService.axiosRef.get(url, {
                responseType: 'arraybuffer',
            });
            res.setHeader('Content-Type', imageResponse.headers['content-type']);
            res.send(imageResponse.data);
        }
        catch (error) {
            this.logger.error(`Error al cargar imagen: ${error.message}`);
            throw new common_1.HttpException('No se pudo cargar la imagen remota', common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async serveAudio(filename, res) {
        try {
            const buffer = await this.mediaBridgeService.fetchAudioFile(filename);
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            res.send(buffer);
        }
        catch (error) {
            throw new common_1.HttpException('Audio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getSignedImageUrl(filename) {
        const signedUrl = await this.azureBlobService.getSignedUrl(filename, 86400);
        return { url: signedUrl };
    }
    async getMyImages(req) {
        const userId = req.user?.sub;
        if (!userId) {
            throw new common_1.UnauthorizedException('No se pudo obtener el usuario del token');
        }
        const images = await this.imageService.getImagesByUserId(userId);
        return images;
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)(':type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)('images'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getImages", null);
__decorate([
    (0, common_1.Get)('proxy-image'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "proxyImage", null);
__decorate([
    (0, common_1.Get)('preview/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "serveAudio", null);
__decorate([
    (0, common_1.Get)('/signed-image/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getSignedImageUrl", null);
__decorate([
    (0, common_1.Get)('my-images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getMyImages", null);
exports.MediaController = MediaController = MediaController_1 = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [use_service_use_case_1.UseServiceUseCase,
        media_bridge_service_1.MediaBridgeService,
        user_service_1.UserService,
        generated_image_service_1.GeneratedImageService,
        axios_1.HttpService,
        azure_blob_services_1.AzureBlobService])
], MediaController);
//# sourceMappingURL=media.controller.js.map