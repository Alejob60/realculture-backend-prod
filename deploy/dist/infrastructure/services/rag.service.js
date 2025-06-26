"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RagService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let RagService = RagService_1 = class RagService {
    logger = new common_1.Logger(RagService_1.name);
    async fetchContextFromAzureSearch(prompt) {
        try {
            const response = await axios_1.default.post(`https://${process.env.AZURE_SEARCH_SERVICE}.search.windows.net/indexes/${process.env.AZURE_SEARCH_INDEX}/docs/search?api-version=2021-04-30-Preview`, {
                search: prompt,
                top: 3,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AZURE_SEARCH_API_KEY,
                },
            });
            const docs = response.data.value;
            const context = docs.map((doc) => `• ${doc.content}`).join('\n\n');
            return (context || 'Sin resultados relevantes en la base de conocimientos.');
        }
        catch (error) {
            this.logger.error('❌ Error consultando Azure Cognitive Search', error.message);
            return 'Error al recuperar el contexto.';
        }
    }
    async generateWithOpenAI(prompt) {
        const context = await this.fetchContextFromAzureSearch(prompt);
        try {
            const response = await axios_1.default.post(`${process.env.OPENAI_API_ENDPOINT}/openai/deployments/${process.env.OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-15-preview`, {
                messages: [
                    {
                        role: 'system',
                        content: 'Responde como un influencer virtual carismático, creativo y motivador. Usa lenguaje actual, fresco y cercano a la audiencia joven.',
                    },
                    {
                        role: 'user',
                        content: `Contexto:\n${context}`,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.8,
                max_tokens: 800,
            }, {
                headers: {
                    'api-key': process.env.OPENAI_API_KEY,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.choices[0].message.content;
        }
        catch (error) {
            this.logger.error('❌ Error generando respuesta con OpenAI GPT-4o', error.message);
            return 'No fue posible generar una respuesta en este momento.';
        }
    }
};
exports.RagService = RagService;
exports.RagService = RagService = RagService_1 = __decorate([
    (0, common_1.Injectable)()
], RagService);
//# sourceMappingURL=rag.service.js.map