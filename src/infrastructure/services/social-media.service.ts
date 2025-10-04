import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SocialMediaService {
  private readonly logger = new Logger(SocialMediaService.name);

  // Configuración de las APIs de redes sociales
  private readonly FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';
  private readonly INSTAGRAM_API_URL = 'https://graph.instagram.com/v18.0';
  private readonly TWITTER_API_URL = 'https://api.twitter.com/2';
  private readonly TIKTOK_API_URL = 'https://open-api.tiktok.com';
  private readonly LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

  /**
   * Publica una imagen en Facebook
   */
  async postImageToFacebook(accessToken: string, pageId: string, imageUrl: string, caption: string) {
    try {
      // Primero subimos la imagen
      const uploadResponse = await axios.post(`${this.FACEBOOK_API_URL}/${pageId}/photos`, null, {
        params: {
          url: imageUrl,
          caption,
          access_token: accessToken,
        },
      });

      return {
        success: true,
        postId: uploadResponse.data.post_id,
        message: 'Imagen publicada exitosamente en Facebook',
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en Facebook:', error.message);
      throw new Error(`Error al publicar en Facebook: ${error.message}`);
    }
  }

  /**
   * Publica un video en Facebook
   */
  async postVideoToFacebook(accessToken: string, pageId: string, videoUrl: string, title: string, description: string) {
    try {
      const uploadResponse = await axios.post(`${this.FACEBOOK_API_URL}/${pageId}/videos`, null, {
        params: {
          file_url: videoUrl,
          title,
          description,
          access_token: accessToken,
        },
      });

      return {
        success: true,
        videoId: uploadResponse.data.id,
        message: 'Video publicado exitosamente en Facebook',
      };
    } catch (error) {
      this.logger.error('Error al publicar video en Facebook:', error.message);
      throw new Error(`Error al publicar video en Facebook: ${error.message}`);
    }
  }

  /**
   * Publica una imagen en Instagram
   */
  async postImageToInstagram(accessToken: string, instagramAccountId: string, imageUrl: string, caption: string) {
    try {
      // Primero creamos el contenedor de medios
      const containerResponse = await axios.post(
        `${this.INSTAGRAM_API_URL}/${instagramAccountId}/media`,
        null,
        {
          params: {
            image_url: imageUrl,
            caption,
            access_token: accessToken,
          },
        }
      );

      const creationId = containerResponse.data.id;

      // Luego publicamos el contenedor
      const publishResponse = await axios.post(
        `${this.INSTAGRAM_API_URL}/${instagramAccountId}/media_publish`,
        null,
        {
          params: {
            creation_id: creationId,
            access_token: accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId: publishResponse.data.id,
        message: 'Imagen publicada exitosamente en Instagram',
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en Instagram:', error.message);
      throw new Error(`Error al publicar en Instagram: ${error.message}`);
    }
  }

  /**
   * Publica un video en Instagram
   */
  async postVideoToInstagram(accessToken: string, instagramAccountId: string, videoUrl: string, caption: string) {
    try {
      // Creamos el contenedor de video
      const containerResponse = await axios.post(
        `${this.INSTAGRAM_API_URL}/${instagramAccountId}/media`,
        null,
        {
          params: {
            media_type: 'VIDEO',
            video_url: videoUrl,
            caption,
            access_token: accessToken,
          },
        }
      );

      const creationId = containerResponse.data.id;

      // Publicamos el contenedor
      const publishResponse = await axios.post(
        `${this.INSTAGRAM_API_URL}/${instagramAccountId}/media_publish`,
        null,
        {
          params: {
            creation_id: creationId,
            access_token: accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId: publishResponse.data.id,
        message: 'Video publicado exitosamente en Instagram',
      };
    } catch (error) {
      this.logger.error('Error al publicar video en Instagram:', error.message);
      throw new Error(`Error al publicar video en Instagram: ${error.message}`);
    }
  }

  /**
   * Publica un tweet en Twitter
   */
  async postToTwitter(bearerToken: string, text: string, mediaUrl?: string) {
    try {
      const payload: any = { text };

      // Si hay una imagen, la subimos primero
      if (mediaUrl) {
        const mediaResponse = await axios.post(`${this.TWITTER_API_URL}/tweets`, {
          text,
          media: {
            media_entities: [
              {
                media_url: mediaUrl,
              },
            ],
          },
        }, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        return {
          success: true,
          tweetId: mediaResponse.data.data.id,
          message: 'Tweet con imagen publicado exitosamente',
        };
      } else {
        const tweetResponse = await axios.post(`${this.TWITTER_API_URL}/tweets`, payload, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        return {
          success: true,
          tweetId: tweetResponse.data.data.id,
          message: 'Tweet publicado exitosamente',
        };
      }
    } catch (error) {
      this.logger.error('Error al publicar en Twitter:', error.message);
      throw new Error(`Error al publicar en Twitter: ${error.message}`);
    }
  }

  /**
   * Publica un video en TikTok
   */
  async postToTiktok(accessToken: string, videoUrl: string, title: string, description: string) {
    try {
      const payload = {
        video_url: videoUrl,
        title,
        description,
        access_token: accessToken,
      };

      const response = await axios.post(`${this.TIKTOK_API_URL}/video/upload`, payload);

      return {
        success: true,
        videoId: response.data.data.video_id,
        message: 'Video publicado exitosamente en TikTok',
      };
    } catch (error) {
      this.logger.error('Error al publicar en TikTok:', error.message);
      throw new Error(`Error al publicar en TikTok: ${error.message}`);
    }
  }

  /**
   * Publica una imagen en LinkedIn
   */
  async postImageToLinkedIn(accessToken: string, urn: string, imageUrl: string, title: string, description: string) {
    try {
      const payload = {
        author: urn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: description,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                description: {
                  text: description,
                },
                media: imageUrl,
                title: {
                  text: title,
                },
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post(`${this.LINKEDIN_API_URL}/ugcPosts`, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return {
        success: true,
        postId: response.data.id,
        message: 'Imagen publicada exitosamente en LinkedIn',
      };
    } catch (error) {
      this.logger.error('Error al publicar imagen en LinkedIn:', error.message);
      throw new Error(`Error al publicar en LinkedIn: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de una publicación en Facebook
   */
  async getFacebookPostStats(accessToken: string, postId: string) {
    try {
      const response = await axios.get(`${this.FACEBOOK_API_URL}/${postId}`, {
        params: {
          fields: 'engagement,shares,comments.summary(true),likes.summary(true)',
          access_token: accessToken,
        },
      });

      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Facebook:', error.message);
      throw new Error(`Error al obtener estadísticas de Facebook: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de una publicación en Instagram
   */
  async getInstagramPostStats(accessToken: string, mediaId: string) {
    try {
      const response = await axios.get(`${this.INSTAGRAM_API_URL}/${mediaId}`, {
        params: {
          fields: 'like_count,comments_count,engagement',
          access_token: accessToken,
        },
      });

      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Instagram:', error.message);
      throw new Error(`Error al obtener estadísticas de Instagram: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de un tweet
   */
  async getTwitterPostStats(bearerToken: string, tweetId: string) {
    try {
      const response = await axios.get(`${this.TWITTER_API_URL}/tweets/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        params: {
          'tweet.fields': 'public_metrics',
        },
      });

      return {
        success: true,
        stats: response.data.data.public_metrics,
      };
    } catch (error) {
      this.logger.error('Error al obtener estadísticas de Twitter:', error.message);
      throw new Error(`Error al obtener estadísticas de Twitter: ${error.message}`);
    }
  }
}