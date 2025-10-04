import { Injectable } from '@nestjs/common';
import { SocialMediaService } from '../../infrastructure/services/social-media.service';

@Injectable()
export class SocialMediaUseCase {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  /**
   * Publica contenido en múltiples redes sociales
   */
  async publishToMultiplePlatforms(
    platforms: Array<'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin'>,
    content: {
      text?: string;
      mediaUrl?: string;
      title?: string;
      description?: string;
    },
    tokens: {
      facebook?: { accessToken: string; pageId: string };
      instagram?: { accessToken: string; accountId: string };
      twitter?: { bearerToken: string };
      tiktok?: { accessToken: string };
      linkedin?: { accessToken: string; urn: string };
    },
  ) {
    const results = [];

    // Publicar en Facebook si está en la lista de plataformas
    if (platforms.includes('facebook') && tokens.facebook) {
      try {
        let result;
        if (content.mediaUrl && (content.mediaUrl.includes('.jpg') || content.mediaUrl.includes('.png'))) {
          result = await this.socialMediaService.postImageToFacebook(
            tokens.facebook.accessToken,
            tokens.facebook.pageId,
            content.mediaUrl,
            content.text || content.description || '',
          );
        } else if (content.mediaUrl && content.mediaUrl.includes('.mp4')) {
          result = await this.socialMediaService.postVideoToFacebook(
            tokens.facebook.accessToken,
            tokens.facebook.pageId,
            content.mediaUrl,
            content.title || 'Video publicado',
            content.description || content.text || '',
          );
        }
        results.push({ platform: 'facebook', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'facebook', success: false, error: error.message });
      }
    }

    // Publicar en Instagram si está en la lista de plataformas
    if (platforms.includes('instagram') && tokens.instagram) {
      try {
        let result;
        if (content.mediaUrl && (content.mediaUrl.includes('.jpg') || content.mediaUrl.includes('.png'))) {
          result = await this.socialMediaService.postImageToInstagram(
            tokens.instagram.accessToken,
            tokens.instagram.accountId,
            content.mediaUrl,
            content.text || content.description || '',
          );
        } else if (content.mediaUrl && content.mediaUrl.includes('.mp4')) {
          result = await this.socialMediaService.postVideoToInstagram(
            tokens.instagram.accessToken,
            tokens.instagram.accountId,
            content.mediaUrl,
            content.text || content.description || '',
          );
        }
        results.push({ platform: 'instagram', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'instagram', success: false, error: error.message });
      }
    }

    // Publicar en Twitter si está en la lista de plataformas
    if (platforms.includes('twitter') && tokens.twitter) {
      try {
        const result = await this.socialMediaService.postToTwitter(
          tokens.twitter.bearerToken,
          content.text || '',
          content.mediaUrl,
        );
        results.push({ platform: 'twitter', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'twitter', success: false, error: error.message });
      }
    }

    // Publicar en TikTok si está en la lista de plataformas
    if (platforms.includes('tiktok') && tokens.tiktok) {
      try {
        if (content.mediaUrl && content.mediaUrl.includes('.mp4')) {
          const result = await this.socialMediaService.postToTiktok(
            tokens.tiktok.accessToken,
            content.mediaUrl,
            content.title || 'Video publicado',
            content.description || content.text || '',
          );
          results.push({ platform: 'tiktok', success: true, data: result });
        } else {
          results.push({ platform: 'tiktok', success: false, error: 'TikTok solo permite publicar videos' });
        }
      } catch (error) {
        results.push({ platform: 'tiktok', success: false, error: error.message });
      }
    }

    // Publicar en LinkedIn si está en la lista de plataformas
    if (platforms.includes('linkedin') && tokens.linkedin) {
      try {
        if (content.mediaUrl && (content.mediaUrl.includes('.jpg') || content.mediaUrl.includes('.png'))) {
          const result = await this.socialMediaService.postImageToLinkedIn(
            tokens.linkedin.accessToken,
            tokens.linkedin.urn,
            content.mediaUrl,
            content.title || 'Imagen publicada',
            content.description || content.text || '',
          );
          results.push({ platform: 'linkedin', success: true, data: result });
        } else {
          results.push({ platform: 'linkedin', success: false, error: 'LinkedIn solo permite publicar imágenes por ahora' });
        }
      } catch (error) {
        results.push({ platform: 'linkedin', success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Obtiene estadísticas de una publicación en múltiples plataformas
   */
  async getStatsFromMultiplePlatforms(
    platforms: Array<'facebook' | 'instagram' | 'twitter'>,
    postIds: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    },
    tokens: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    },
  ) {
    const results = [];

    // Obtener estadísticas de Facebook
    if (platforms.includes('facebook') && postIds.facebook && tokens.facebook) {
      try {
        const result = await this.socialMediaService.getFacebookPostStats(tokens.facebook, postIds.facebook);
        results.push({ platform: 'facebook', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'facebook', success: false, error: error.message });
      }
    }

    // Obtener estadísticas de Instagram
    if (platforms.includes('instagram') && postIds.instagram && tokens.instagram) {
      try {
        const result = await this.socialMediaService.getInstagramPostStats(tokens.instagram, postIds.instagram);
        results.push({ platform: 'instagram', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'instagram', success: false, error: error.message });
      }
    }

    // Obtener estadísticas de Twitter
    if (platforms.includes('twitter') && postIds.twitter && tokens.twitter) {
      try {
        const result = await this.socialMediaService.getTwitterPostStats(tokens.twitter, postIds.twitter);
        results.push({ platform: 'twitter', success: true, data: result });
      } catch (error) {
        results.push({ platform: 'twitter', success: false, error: error.message });
      }
    }

    return results;
  }
}