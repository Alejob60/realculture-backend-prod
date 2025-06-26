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
exports.InfluencerController = void 0;
const common_1 = require("@nestjs/common");
const influencer_repository_1 = require("../../infrastructure/database/influencer.repository");
let InfluencerController = class InfluencerController {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(body) {
        return this.repo.create(body);
    }
    async findAll() {
        return this.repo.findAll();
    }
    async findById(id) {
        return this.repo.findById(id);
    }
};
exports.InfluencerController = InfluencerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InfluencerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfluencerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfluencerController.prototype, "findById", null);
exports.InfluencerController = InfluencerController = __decorate([
    (0, common_1.Controller)('influencers'),
    __metadata("design:paramtypes", [influencer_repository_1.InfluencerRepository])
], InfluencerController);
//# sourceMappingURL=influencer.controller.js.map