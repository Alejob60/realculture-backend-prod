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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const generated_image_entity_1 = require("../../domain/entities/generated-image.entity");
const generated_video_entity_1 = require("../../domain/entities/generated-video.entity");
const generated_audio_entity_1 = require("../../domain/entities/generated-audio.entity");
const generated_music_entity_1 = require("../../domain/entities/generated-music.entity");
let GalleryService = class GalleryService {
    imageRepo;
    videoRepo;
    audioRepo;
    musicRepo;
    constructor(imageRepo, videoRepo, audioRepo, musicRepo) {
        this.imageRepo = imageRepo;
        this.videoRepo = videoRepo;
        this.audioRepo = audioRepo;
        this.musicRepo = musicRepo;
    }
    async getUserGallery(userId) {
        const [images, videos, audios, music] = await Promise.all([
            this.imageRepo.find({
                where: { user: { userId } },
                order: { createdAt: 'DESC' },
            }),
            this.videoRepo.find({
                where: { user: { userId } },
                order: { createdAt: 'DESC' },
            }),
            this.audioRepo.find({
                where: { user: { userId } },
                order: { createdAt: 'DESC' },
            }),
            this.musicRepo.find({
                where: { user: { userId } },
                order: { createdAt: 'DESC' },
            }),
        ]);
        return {
            images,
            videos,
            audios,
            music,
        };
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(generated_image_entity_1.GeneratedImageEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(generated_video_entity_1.GeneratedVideoEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(generated_audio_entity_1.GeneratedAudioEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(generated_music_entity_1.GeneratedMusicEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map