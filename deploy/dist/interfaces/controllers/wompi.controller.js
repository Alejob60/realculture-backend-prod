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
exports.WompiController = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let WompiController = class WompiController {
    getCheckoutData(plan) {
        const priceMap = {
            pro: 11600000,
            creator: 23600000,
        };
        if (!plan || !(plan in priceMap)) {
            throw new common_1.BadRequestException(`Plan inválido: ${plan}`);
        }
        const amount = priceMap[plan];
        const currency = 'COP';
        const reference = `realculture_${plan}_${Date.now()}`;
        const publicKey = process.env.WOMPI_PUBLIC_KEY;
        const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
        const redirectUrl = process.env.WOMPI_REDIRECT_URL;
        const signature = crypto
            .createHash('sha256')
            .update(`${amount}${currency}${reference}${integrityKey}`)
            .digest('hex');
        console.log(`🔐 Generando firma para plan ${plan}`);
        return {
            publicKey,
            currency,
            amount,
            reference,
            redirectUrl,
            signature,
        };
    }
};
exports.WompiController = WompiController;
__decorate([
    (0, common_1.Get)('/checkout-data'),
    __param(0, (0, common_1.Query)('plan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WompiController.prototype, "getCheckoutData", null);
exports.WompiController = WompiController = __decorate([
    (0, common_1.Controller)('wompi')
], WompiController);
//# sourceMappingURL=wompi.controller.js.map