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
var MediaBridgeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaBridgeService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const axios_2 = require("axios");
const rxjs_1 = require("rxjs");
let MediaBridgeService = MediaBridgeService_1 = class MediaBridgeService {
    httpService;
    logger = new common_1.Logger(MediaBridgeService_1.name);
    generatorUrl = process.env.VIDEO_GEN_URL || 'http://localhost:4000';
    VIDEO_SERVICE_URL = process.env.VIDEO_SERVICE_URL;
    constructor(httpService) {
        this.httpService = httpService;
    }
    buildHeaders(token) {
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    }
    async generatePromoImage(data) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/media/image`, data, { headers: { 'Content-Type': 'application/json' } });
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar imagen (bridge):', error.message);
            throw error;
        }
    }
    async generateVideo(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/videos/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar video:', error.message);
            throw error;
        }
    }
    async generateVoice(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/voice/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar voz:', error.message);
            throw error;
        }
    }
    async generateMusic(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/music/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar música:', error.message);
            throw error;
        }
    }
    async generateAgent(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/agent/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar agente IA:', error.message);
            throw error;
        }
    }
    async generateSubtitles(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/subtitles/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar subtítulos:', error.message);
            throw error;
        }
    }
    async generateAvatar(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/avatar/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al generar avatar IA:', error.message);
            throw error;
        }
    }
    async generateCampaign(data, token) {
        try {
            const response = await axios_2.default.post(`${this.generatorUrl}/campaign/generate`, data, this.buildHeaders(token));
            return response.data;
        }
        catch (error) {
            this.logger.error('❌ Error al automatizar campaña IA:', error.message);
            throw error;
        }
    }
    async fetchAudioFile(filename) {
        try {
            const url = `${this.generatorUrl}/audio/${filename}`;
            const response = await axios_2.default.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data);
        }
        catch (error) {
            this.logger.error(`❌ Error al obtener archivo de audio ${filename}:`, error.message);
            throw error;
        }
    }
    async forward(endpoint, req, payload) {
        const url = `${this.VIDEO_SERVICE_URL}/${endpoint}`;
        const headers = {
            Authorization: req.headers['authorization'] || '',
            'Content-Type': 'application/json',
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, { headers }));
            const data = response.data;
            if (!data || (!data.script && !data.result)) {
                this.logger.error(`❌ Respuesta inesperada: ${JSON.stringify(data)}`);
                throw new Error('Respuesta inesperada del servicio.');
            }
            return data.result ?? data;
        }
        catch (error) {
            this.logger.error(`❌ Error reenviando a ${url}`, error);
            throw new Error('Error al reenviar la solicitud al microservicio de video.');
        }
    }
};
exports.MediaBridgeService = MediaBridgeService;
exports.MediaBridgeService = MediaBridgeService = MediaBridgeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], MediaBridgeService);
//# sourceMappingURL=media-bridge.service.js.map