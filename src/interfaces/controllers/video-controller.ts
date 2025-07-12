import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { UserService } from '../../infrastructure/services/user.service';
import { AzureBlobService } from '../../infrastructure/services/azure-blob.services';
import { Content } from '../../domain/entities/content.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const PLAN_CREDITS = {
  'promo-video': {
    free: 25,
    creator: 300,
    pro: 1000,
  },
};

@Controller('api/promo-video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(
    private readonly mediaBridge: MediaBridgeService,
    private readonly userService: UserService,
    private readonly azureBlobService: AzureBlobService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generatePromoVideo(@Body() body: any, @Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = (req as any)?.user?.userId;

    if (!token || !userId) {
      throw new HttpException('Token inválido o usuario no identificado', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const plan = user.role?.toLowerCase?.() || 'free';
    const requiredCredits = PLAN_CREDITS['promo-video'][plan];

    if (requiredCredits === undefined) {
      throw new HttpException(
        `Tu plan actual (${plan}) no permite generar videos promocionales`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.credits < requiredCredits) {
      throw new HttpException('Créditos insuficientes', HttpStatus.FORBIDDEN);
    }

    const requestPayload = {
      prompt: body.prompt,
      useVoice: body.useVoice ?? false,
      useSubtitles: body.useSubtitles ?? false,
      useMusic: body.useMusic ?? false,
      useSora: body.useSora ?? true,
      plan,
    };

    let result;
    try {
      this.logger.log(`📡 Enviando solicitud a MediaBridge con: ${JSON.stringify(requestPayload)}`);
      result = await this.mediaBridge.generateVideo(requestPayload, token);
    } catch (err: any) {
      this.logger.error(`❌ Error al generar video desde MediaBridge: ${err.message}`);
      throw new HttpException('Error interno al generar el video', HttpStatus.BAD_GATEWAY);
    }

    if (!result?.success || !result.result?.videoUrl) {
      this.logger.error(`⚠️ Respuesta inválida del servicio de video: ${JSON.stringify(result)}`);
      throw new HttpException('No se pudo generar el video correctamente', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const {
      prompt,
      videoUrl,
      fileName,
      duration: videoDuration,
      soraJobId,
      generationId,
      audioUrl,
      script,
      subtitles,
    } = result.result;

    const signedUrl = await this.azureBlobService.getSignedUrl({
      filename: fileName,
      container: 'videos',
      expiresInSeconds: plan === 'free' ? 86400 : 2592000,
    });

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + (plan === 'free' ? 86400 : 2592000) * 1000);

    const content = this.contentRepository.create({
      userId,
      type: 'video',
      prompt,
      mediaUrl: signedUrl,
      status: 'success',
      createdAt,
      expiresAt,
      filename: fileName,
      duration: videoDuration,
      title: prompt?.slice(0, 80) || 'Video generado con IA', // ✅ evita null
      description: script?.slice(0, 200) || null,
      metadata: JSON.stringify({
        soraJobId,
        generationId,
        originalUrl: videoUrl,
        audioUrl: audioUrl ?? null,
        script: script ?? null,
        subtitles: subtitles ?? null,
      }),
    });

    await this.contentRepository.save(content);

    // 💳 Descontar créditos
    try {
      user.credits -= requiredCredits;
      await this.userService.save(user);
    } catch (saveErr: any) {
      this.logger.error(`❌ Error al guardar créditos del usuario: ${saveErr.message}`);
      throw new HttpException('Error al actualizar los créditos del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      success: true,
      message: '🎬 Video generado y guardado correctamente',
      result: {
        prompt,
        videoUrl: signedUrl,
        fileName,
        expiresAt,
      },
      credits: user.credits,
    };
  }
}
