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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const content_repository_1 = require("../database/content.repository");
const user_repository_1 = require("../database/user.repository");
let ContentService = class ContentService {
    contentRepository;
    userRepository;
    constructor(contentRepository, userRepository) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
    }
    async create(contentData) {
        return this.contentRepository.create(contentData);
    }
    async findAll() {
        return this.contentRepository.findAll();
    }
    async findOne(id) {
        const content = await this.contentRepository.findOne(id);
        if (!content)
            throw new common_1.NotFoundException(`Content with ID ${id} not found`);
        return content;
    }
    async update(id, updateData) {
        const existing = await this.findOne(id);
        return this.contentRepository.update(existing.id, updateData);
    }
    async remove(id) {
        const existing = await this.findOne(id);
        return this.contentRepository.delete(existing.id);
    }
    async saveAudioToGallery(params) {
        const { userId, script, mediaUrl } = params;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado para guardar audio');
        }
        return this.contentRepository.create({
            title: `Audio generado el ${new Date().toLocaleDateString()}`,
            description: script,
            mediaUrl,
            creator: user,
            type: 'audio',
        });
    }
    async save(data) {
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado para guardar contenido');
        }
        const content = {
            title: `${data.type} generado el ${data.createdAt.toLocaleDateString()}`,
            description: data.prompt,
            mediaUrl: data.url,
            duration: data.duration,
            type: data.type,
            creator: user,
            createdAt: data.createdAt,
        };
        await this.contentRepository.create(content);
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository,
        user_repository_1.UserRepository])
], ContentService);
//# sourceMappingURL=content.service.js.map