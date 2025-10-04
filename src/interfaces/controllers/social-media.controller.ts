import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SocialMediaService } from '../../infrastructure/services/social-media.service';
import { ContentService } from '../../infrastructure/services/content.service';

@Controller('social-media')
export class SocialMediaController {
  private readonly logger = new Logger(SocialMediaController.name);

  constructor(
    private readonly socialMediaService: SocialMediaService,
    private readonly contentService: ContentService,
  ) {}

  /**
   * Publica una imagen en Facebook
   */
  @UseGuards(JwtAuthGuard)
  @Post('facebook/image')
  async postImageToFacebook(
    @Body() body: { pageId: string; imageUrl: string; caption: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { pageId, imageUrl, caption } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!pageId || !imageUrl || !caption) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postImageToFacebook(accessToken, pageId, imageUrl, caption);

      return {
        success: true,
        message: 'Imagen publicada exitosamente en Facebook',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en Facebook:', error.message);
      throw new HttpException(
        `Error al publicar imagen en Facebook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica un video en Facebook
   */
  @UseGuards(JwtAuthGuard)
  @Post('facebook/video')
  async postVideoToFacebook(
    @Body() body: { pageId: string; videoUrl: string; title: string; description: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { pageId, videoUrl, title, description } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!pageId || !videoUrl || !title || !description) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postVideoToFacebook(accessToken, pageId, videoUrl, title, description);

      return {
        success: true,
        message: 'Video publicado exitosamente en Facebook',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar video en Facebook:', error.message);
      throw new HttpException(
        `Error al publicar video en Facebook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica una imagen en Instagram
   */
  @UseGuards(JwtAuthGuard)
  @Post('instagram/image')
  async postImageToInstagram(
    @Body() body: { instagramAccountId: string; imageUrl: string; caption: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { instagramAccountId, imageUrl, caption } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!instagramAccountId || !imageUrl || !caption) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postImageToInstagram(accessToken, instagramAccountId, imageUrl, caption);

      return {
        success: true,
        message: 'Imagen publicada exitosamente en Instagram',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en Instagram:', error.message);
      throw new HttpException(
        `Error al publicar imagen en Instagram: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica un video en Instagram
   */
  @UseGuards(JwtAuthGuard)
  @Post('instagram/video')
  async postVideoToInstagram(
    @Body() body: { instagramAccountId: string; videoUrl: string; caption: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { instagramAccountId, videoUrl, caption } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!instagramAccountId || !videoUrl || !caption) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postVideoToInstagram(accessToken, instagramAccountId, videoUrl, caption);

      return {
        success: true,
        message: 'Video publicado exitosamente en Instagram',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar video en Instagram:', error.message);
      throw new HttpException(
        `Error al publicar video en Instagram: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica un tweet en Twitter
   */
  @UseGuards(JwtAuthGuard)
  @Post('twitter/tweet')
  async postToTwitter(
    @Body() body: { text: string; mediaUrl?: string },
    @Req() req: Request,
  ) {
    try {
      const bearerToken = req.headers['authorization']?.replace('Bearer ', '');
      const { text, mediaUrl } = body;

      if (!bearerToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!text) {
        throw new HttpException('El texto del tweet es requerido', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postToTwitter(bearerToken, text, mediaUrl);

      return {
        success: true,
        message: 'Tweet publicado exitosamente',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar en Twitter:', error.message);
      throw new HttpException(
        `Error al publicar en Twitter: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica un video en TikTok
   */
  @UseGuards(JwtAuthGuard)
  @Post('tiktok/video')
  async postToTiktok(
    @Body() body: { videoUrl: string; title: string; description: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { videoUrl, title, description } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!videoUrl || !title || !description) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postToTiktok(accessToken, videoUrl, title, description);

      return {
        success: true,
        message: 'Video publicado exitosamente en TikTok',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar en TikTok:', error.message);
      throw new HttpException(
        `Error al publicar en TikTok: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Publica una imagen en LinkedIn
   */
  @UseGuards(JwtAuthGuard)
  @Post('linkedin/image')
  async postImageToLinkedIn(
    @Body() body: { urn: string; imageUrl: string; title: string; description: string },
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');
      const { urn, imageUrl, title, description } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      if (!urn || !imageUrl || !title || !description) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.postImageToLinkedIn(accessToken, urn, imageUrl, title, description);

      return {
        success: true,
        message: 'Imagen publicada exitosamente en LinkedIn',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en LinkedIn:', error.message);
      throw new HttpException(
        `Error al publicar imagen en LinkedIn: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene estadísticas de una publicación en Facebook
   */
  @UseGuards(JwtAuthGuard)
  @Get('facebook/stats/:postId')
  async getFacebookPostStats(
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.getFacebookPostStats(accessToken, postId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Facebook:', error.message);
      throw new HttpException(
        `Error al obtener estadísticas de Facebook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene estadísticas de una publicación en Instagram
   */
  @UseGuards(JwtAuthGuard)
  @Get('instagram/stats/:mediaId')
  async getInstagramPostStats(
    @Param('mediaId') mediaId: string,
    @Req() req: Request,
  ) {
    try {
      const accessToken = req.headers['authorization']?.replace('Bearer ', '');

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.getInstagramPostStats(accessToken, mediaId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Instagram:', error.message);
      throw new HttpException(
        `Error al obtener estadísticas de Instagram: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene estadísticas de un tweet
   */
  @UseGuards(JwtAuthGuard)
  @Get('twitter/stats/:tweetId')
  async getTwitterPostStats(
    @Param('tweetId') tweetId: string,
    @Req() req: Request,
  ) {
    try {
      const bearerToken = req.headers['authorization']?.replace('Bearer ', '');

      if (!bearerToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const result = await this.socialMediaService.getTwitterPostStats(bearerToken, tweetId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Twitter:', error.message);
      throw new HttpException(
        `Error al obtener estadísticas de Twitter: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}