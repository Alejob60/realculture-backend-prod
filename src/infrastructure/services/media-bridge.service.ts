import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class MediaBridgeService {
  private readonly logger = new Logger(MediaBridgeService.name);
  private readonly generatorUrl = process.env.GENERATOR_SERVICE_URL || 'http://localhost:4000';
  private readonly VIDEO_SERVICE_URL = process.env.VIDEO_SERVICE_URL!;

  constructor(private readonly httpService: HttpService) {}

  private buildHeaders(token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return {
      headers,
      timeout: 120_000,
    };
  }

  // ✅ Generación de imágenes
  async generatePromoImage({ prompt, textOverlay = 'false', plan }: {
    prompt: string;
    textOverlay?: string;
    plan: string;
  }): Promise<any> {
    const url = `${this.generatorUrl}/media/image`;
    const payload = { prompt, textOverlay, plan };

    try {
      const response = await this.httpService.axiosRef.post(url, payload, this.buildHeaders());
      this.logger.log(`✅ Imagen generada: ${response.data.result.imageUrl}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      this.logger.error(`❌ Error en ${url}: ${message}`);
      throw new HttpException(`Error al generar imagen: ${message}`, error.response?.status || 500);
    }
  }

  // ✅ Generación de video SIN duration
  async generateVideo(data: any, token?: string) {
    const url = `${this.VIDEO_SERVICE_URL}/videos/generate`;

    const payload = {
      prompt: data.prompt,
      useVoice: Boolean(data.useVoice),
      useSubtitles: Boolean(data.useSubtitles),
      useMusic: Boolean(data.useMusic),
      useSora: Boolean(data.useSora),
      plan: data.plan ?? 'free',
    };

    try {
      this.logger.debug(`📤 Enviando a ${url}: ${JSON.stringify(payload)}`);
      const response = await axios.post(url, payload, this.buildHeaders(token));
      const result = response.data;
      this.logger.debug(`📥 Respuesta completa: ${JSON.stringify(result)}`);

      if (!result?.success) {
        this.logger.error(`❌ Generador devolvió error: ${JSON.stringify(result)}`);
        throw new Error(result?.message || 'Error al generar video');
      }

      if (!result.result || !result.result.videoUrl) {
        const errorMsg = result.result?.error || 'Falta videoUrl en la respuesta';
        this.logger.error(`⚠️ Respuesta sin video URL: ${JSON.stringify(result.result)}`);
        throw new Error(errorMsg);
      }

      this.logger.log(`✅ Video generado: ${result.result.fileName}`);
      return result;
    } catch (error: any) {
      const message = JSON.stringify(error.response?.data || error.message);
      this.logger.error(`❌ Error al generar video: ${message}`);

      if (!data.__isRetry) {
        this.logger.warn('🔁 Reintentando una vez más...');
        const retryData = { ...data, __isRetry: true };
        return this.generateVideo(retryData, token);
      }

      throw new HttpException(`Error al generar video: ${message}`, error.response?.status || 500);
    }
  }

  async generateVoice(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/voice/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al generar voz: ${error.message}`);
      throw error;
    }
  }

  async generateMusic(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/music/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al generar música: ${error.message}`);
      throw error;
    }
  }

  async generateAgent(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/agent/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al generar agente IA: ${error.message}`);
      throw error;
    }
  }

  async generateSubtitles(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/subtitles/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al generar subtítulos: ${error.message}`);
      throw error;
    }
  }

  async generateAvatar(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/avatar/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al generar avatar IA: ${error.message}`);
      throw error;
    }
  }

  async generateCampaign(data: any, token?: string) {
    try {
      const response = await axios.post(
        `${this.generatorUrl}/campaign/generate`,
        data,
        this.buildHeaders(token),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`❌ Error al automatizar campaña IA: ${error.message}`);
      throw error;
    }
  }

  async fetchAudioFile(filename: string): Promise<Buffer> {
    try {
      const url = `${this.generatorUrl}/audio/${filename}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data as ArrayBuffer);
    } catch (error) {
      this.logger.error(`❌ Error al obtener audio ${filename}: ${error.message}`);
      throw error;
    }
  }

  async forward(endpoint: string, req: Request, payload: any): Promise<any> {
    const url = `${this.VIDEO_SERVICE_URL}/${endpoint}`;
    const headers = {
      Authorization: req.headers['authorization'] || '',
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );

      const data = response.data;

      if (!data || (!data.script && !data.result)) {
        this.logger.error(`❌ Respuesta inesperada: ${JSON.stringify(data)}`);
        throw new Error('Respuesta inesperada del microservicio.');
      }

      return data.result ?? data;
    } catch (error) {
      const message = JSON.stringify(error.response?.data || error.message);
      this.logger.error(`❌ Error reenviando a ${url}: ${message}`);
      throw new Error(`Error al reenviar al microservicio: ${message}`);
    }
  }
}
