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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let AiService = class AiService {
    configService;
    apiKey;
    endpoint;
    deployment;
    apiVersion;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('OPENAI_API_KEY');
        this.endpoint = this.configService.get('OPEN_API_ENDPOINT');
        this.deployment = this.configService.get('OPENAI_DEPLOYMENT_NAME');
        this.apiVersion = '2024-02-15-preview';
    }
    async generatePromo(prompt) {
        try {
            const url = `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=${this.apiVersion}`;
            const response = await axios_1.default.post(url, {
                messages: [
                    {
                        role: 'system',
                        content: `Eres un influencer virtual creado con inteligencia artificial. Hablas como una figura pública carismática, moderna y creativa. 
Usas frases virales, emojis y lenguaje directo. Siempre te expresas en primera persona y con mucha personalidad. No actúas como asesor ni consultor, sino como el protagonista de la campaña. 
Responde como si fueras una celebridad digital que habla a sus seguidores y promociona productos, ideas o estilos de vida.`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.9,
                max_tokens: 400,
            }, {
                headers: {
                    'api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.choices[0].message.content.trim();
        }
        catch (error) {
            console.error('❌ Error al generar la promoción con Azure OpenAI:', error?.response?.data || error.message);
            throw new common_1.InternalServerErrorException('No se pudo generar la promoción en este momento.');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map