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
exports.ContentUseCase = void 0;
const common_1 = require("@nestjs/common");
const content_repository_1 = require("../../infrastructure/database/content.repository");
let ContentUseCase = class ContentUseCase {
    contentRepository;
    constructor(contentRepository) {
        this.contentRepository = contentRepository;
    }
    create(contentData) {
        return this.contentRepository.create(contentData);
    }
    findAll() {
        return this.contentRepository.findAll();
    }
    findAllByCreator(creatorId) {
        return this.contentRepository.findByCreator(creatorId);
    }
    async findOne(id) {
        const content = await this.contentRepository.findOne(id);
        if (!content)
            throw new common_1.NotFoundException(`Content with ID ${id} not found`);
        return content;
    }
    async update(id, updateData) {
        await this.contentRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        return this.contentRepository.delete(id);
    }
    async registerGeneratedContent(data) {
        const content = {
            userId: data.userId,
            type: data.type,
            description: data.prompt,
            mediaUrl: data.url,
            duration: data.duration,
            status: data.status,
            createdAt: data.createdAt,
        };
        return this.contentRepository.create(content);
    }
};
exports.ContentUseCase = ContentUseCase;
exports.ContentUseCase = ContentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository])
], ContentUseCase);
//# sourceMappingURL=content.use-case.js.map