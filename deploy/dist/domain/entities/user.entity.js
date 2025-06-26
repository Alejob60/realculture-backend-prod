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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const content_entity_1 = require("./content.entity");
const generated_image_entity_1 = require("./generated-image.entity");
const user_role_enum_1 = require("../enums/user-role.enum");
const generated_video_entity_1 = require("./generated-video.entity");
const generated_audio_entity_1 = require("./generated-audio.entity");
const generated_music_entity_1 = require("./generated-music.entity");
let UserEntity = class UserEntity {
    userId;
    email;
    name;
    password;
    googleId;
    role;
    plan;
    picture;
    credits;
    createdAt;
    contents;
    generatedImages;
    generatedVideos;
    generatedAudios;
    generatedMusic;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: user_role_enum_1.UserRole, default: user_role_enum_1.UserRole.FREE }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'FREE' }),
    __metadata("design:type", String)
], UserEntity.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 25 }),
    __metadata("design:type", Number)
], UserEntity.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => content_entity_1.Content, (content) => content.creator),
    __metadata("design:type", Array)
], UserEntity.prototype, "contents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => generated_image_entity_1.GeneratedImageEntity, (image) => image.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "generatedImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => generated_video_entity_1.GeneratedVideoEntity, (video) => video.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "generatedVideos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => generated_audio_entity_1.GeneratedAudioEntity, (audio) => audio.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "generatedAudios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => generated_music_entity_1.GeneratedMusicEntity, (music) => music.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "generatedMusic", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);
//# sourceMappingURL=user.entity.js.map