import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SocialMediaUseCase } from '../../application/use-cases/social-media.use-case';

@Controller('social-media-bulk')
export class SocialMediaBulkController {
  private readonly logger = new Logger(SocialMediaBulkController.name);

  constructor(private readonly socialMediaUseCase: SocialMediaUseCase) {}

  /**
   * Publica contenido en múltiples redes sociales simultáneamente
   */
  @UseGuards(JwtAuthGuard)
  @Post('publish')
  async publishToMultiplePlatforms(
    @Body() body: {
      platforms: Array<'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin'>;
      content: {
        text?: string;
        mediaUrl?: string;
        title?: string;
        description?: string;
      };
      tokens: {
        facebook?: { accessToken: string; pageId: string };
        instagram?: { accessToken: string; accountId: string };
        twitter?: { bearerToken: string };
        tiktok?: { accessToken: string };
        linkedin?: { accessToken: string; urn: string };
      };
    },
    @Req() req: Request,
  ) {
    try {
      const { platforms, content, tokens } = body;

      if (!platforms || platforms.length === 0) {
        throw new HttpException('Debe especificar al menos una plataforma', HttpStatus.BAD_REQUEST);
      }

      if (!content) {
        throw new HttpException('Debe proporcionar contenido para publicar', HttpStatus.BAD_REQUEST);
      }

      const results = await this.socialMediaUseCase.publishToMultiplePlatforms(platforms, content, tokens);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        message: `Publicación completada: ${successful} exitosas, ${failed} fallidas`,
        data: results,
      };
    } catch (error) {
      this.logger.error('Error al publicar en múltiples plataformas:', error.message);
      throw new HttpException(
        `Error al publicar en múltiples plataformas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene estadísticas de una publicación en múltiples plataformas
   */
  @UseGuards(JwtAuthGuard)
  @Post('stats')
  async getStatsFromMultiplePlatforms(
    @Body() body: {
      platforms: Array<'facebook' | 'instagram' | 'twitter'>;
      postIds: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
      };
      tokens: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
      };
    },
    @Req() req: Request,
  ) {
    try {
      const { platforms, postIds, tokens } = body;

      if (!platforms || platforms.length === 0) {
        throw new HttpException('Debe especificar al menos una plataforma', HttpStatus.BAD_REQUEST);
      }

      if (!postIds) {
        throw new HttpException('Debe proporcionar los IDs de las publicaciones', HttpStatus.BAD_REQUEST);
      }

      const results = await this.socialMediaUseCase.getStatsFromMultiplePlatforms(platforms, postIds, tokens);

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        message: `Obtención de estadísticas completada: ${successful} exitosas, ${failed} fallidas`,
        data: results,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de múltiples plataformas:', error.message);
      throw new HttpException(
        `Error al obtener estadísticas de múltiples plataformas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}