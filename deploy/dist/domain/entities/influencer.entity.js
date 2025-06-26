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
exports.InfluencerEntity = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let InfluencerEntity = class InfluencerEntity {
    id;
    name;
    personality;
    style;
    avatarUrl;
    products;
    type;
    demoVideoUrl;
    stats;
};
exports.InfluencerEntity = InfluencerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "personality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "style", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.influencer),
    __metadata("design:type", Array)
], InfluencerEntity.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USER' }),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InfluencerEntity.prototype, "demoVideoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], InfluencerEntity.prototype, "stats", void 0);
exports.InfluencerEntity = InfluencerEntity = __decorate([
    (0, typeorm_1.Entity)('influencers')
], InfluencerEntity);
//# sourceMappingURL=influencer.entity.js.map