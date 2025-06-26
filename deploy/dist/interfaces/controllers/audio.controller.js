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
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const user_service_1 = require("../../infrastructure/services/user.service");
const media_bridge_service_1 = require("../../infrastructure/services/media-bridge.service");
const content_service_1 = require("../../infrastructure/services/content.service");
const audio_complete_dto_1 = require("../dto/audio-complete.dto");
const content_use_case_1 = require("../../application/use-cases/content.use-case");
const AUDIO_DURATION_CREDIT_COST = {
    20: 5,
    30: 10,
    60: 25,
};
let AudioController = class AudioController {
    userService;
    mediaBridgeService;
    contentService;
    contentUseCase;
    constructor(userService, mediaBridgeService, contentService, contentUseCase) {
        this.userService = userService;
        this.mediaBridgeService = mediaBridgeService;
        this.contentService = contentService;
        this.contentUseCase = contentUseCase;
    }
    async generateAudio(dto, req) {
        const userId = req['user']?.userId;
        if (!userId) {
            throw new common_1.HttpException('Usuario no autenticado.', common_1.HttpStatus.UNAUTHORIZED);
        }
        const duration = dto.duration || 20;
        if (![20, 30, 60].includes(duration)) {
            throw new common_1.HttpException('Duración no permitida. Usa 20, 30 o 60 segundos.', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.findById(userId);
        const cost = AUDIO_DURATION_CREDIT_COST[duration];
        if (!user || user.credits < cost) {
            throw new common_1.HttpException('No tienes suficientes créditos para generar este audio.', common_1.HttpStatus.FORBIDDEN);
        }
        await this.userService.decrementCredits(userId, cost);
        const result = await this.mediaBridgeService.forward('audio/generate', req, dto);
        const script = result?.script || '';
        const audioUrl = result?.audioUrl || '';
        if (!script || !audioUrl) {
            throw new common_1.HttpException('Respuesta inválida del servicio de audio.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await this.contentService.create({
            title: script.slice(0, 60),
            description: script,
            mediaUrl: audioUrl,
            creator: user,
        });
        return {
            message: 'Audio generado con éxito',
            script,
            audioUrl,
            duration: result.duration || duration,
            creditsUsed: cost,
        };
    }
    async registerGeneratedAudio(dto) {
        await this.contentUseCase.registerGeneratedContent({
            userId: dto.userId,
            type: 'audio',
            prompt: dto.prompt,
            url: dto.audioUrl,
            duration: dto.duration,
            status: 'complete',
            createdAt: new Date(),
        });
        return { success: true, message: '🎧 Audio registrado exitosamente' };
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Post)('/generate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "generateAudio", null);
__decorate([
    (0, common_1.Post)('/complete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [audio_complete_dto_1.AudioCompleteDto]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "registerGeneratedAudio", null);
exports.AudioController = AudioController = __decorate([
    (0, common_1.Controller)('/api/audio'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        media_bridge_service_1.MediaBridgeService,
        content_service_1.ContentService,
        content_use_case_1.ContentUseCase])
], AudioController);
//# sourceMappingURL=audio.controller.js.map