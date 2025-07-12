import {
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { Content } from '../../domain/entities/content.entity';
import { MediaBridgeService } from './media-bridge.service';
import { AzureBlobService } from './azure-blob.services';
import { UserService } from './user.service';

const PLAN_CREDITS = {
  'promo-video': {
    FREE: 25,
    CREATOR: 25,
    PRO: 15,
  },
};

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mediaBridge: MediaBridgeService,
    private readonly userService: UserService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async generatePromoVideo(userId: string, token: string, body: any) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const plan = user.role?.toUpperCase?.() || 'FREE';
    const requiredCredits = PLAN_CREDITS['promo-video'][plan] ?? null;

    if (requiredCredits === null) {
      throw new HttpException(
        'Tu plan no permite generar videos promocionales',
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.credits < requiredCredits) {
      throw new ForbiddenException('Créditos insuficientes');
    }

    // Llamar al microservicio de generación de video
    const result = await this.mediaBridge.generateVideo(body, token);

    if (!result || !result.success || !result.result?.videoUrl) {
      throw new HttpException(
        'No se pudo generar el video correctamente',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const {
      prompt,
      videoUrl,
      fileName,
      duration,
      soraJobId,
      generationId,
    } = result.result;

    // Firmar URL con SAS Token
    const signedUrl = await this.azureBlobService.getSignedUrl({
      filename: fileName,
      container: 'videos',
      expiresInSeconds: plan === 'FREE' ? 86400 : 2592000, // 1 día o 30 días
    });

    // Fechas
    const createdAt = new Date();
    const expiresAt = new Date(
      createdAt.getTime() + (plan === 'FREE' ? 86400 : 2592000) * 1000,
    );

    // Guardar en base de datos
    const content = this.contentRepository.create({
      userId,
      type: 'video',
      prompt,
      url: signedUrl,
      status: 'success',
      createdAt,
      expiresAt,
      filename: fileName,
      duration,
      metadata: JSON.stringify({
        soraJobId,
        generationId,
        originalUrl: videoUrl,
      }),
    });

    await this.contentRepository.save(content);

    // Descontar créditos al usuario
    user.credits -= requiredCredits;
    await this.userService.save(user);

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
