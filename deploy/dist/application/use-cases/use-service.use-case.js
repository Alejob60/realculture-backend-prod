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
exports.UseServiceUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../infrastructure/services/user.service");
let UseServiceUseCase = class UseServiceUseCase {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async execute(userId, service) {
        const costMap = {
            image: 10,
            video: 25,
            tts: 10,
            voice: 10,
            music: 15,
            subtitles: 5,
            'ai-agent': 150,
            agent: 150,
        };
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new common_1.ForbiddenException('Usuario no encontrado');
        }
        const cost = costMap[service];
        if (user.role === 'FREE' && service === 'ai-agent') {
            throw new common_1.ForbiddenException('Este servicio solo está disponible en planes de pago.');
        }
        if (user.credits < cost) {
            throw new common_1.ForbiddenException('Créditos insuficientes');
        }
        user.credits -= cost;
        await this.userService.save(user);
        return user.credits;
    }
};
exports.UseServiceUseCase = UseServiceUseCase;
exports.UseServiceUseCase = UseServiceUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UseServiceUseCase);
//# sourceMappingURL=use-service.use-case.js.map