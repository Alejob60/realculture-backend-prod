/**
 * Hooks para integración con redes sociales
 * 
 * Este archivo contiene hooks personalizados para facilitar la integración
 * con las principales redes sociales: Facebook, Instagram, Twitter, TikTok y LinkedIn.
 * 
 * Cada hook maneja la autenticación, publicación y obtención de estadísticas
 * para su respectiva plataforma.
 */

import axios from 'axios';

// Tipos para los parámetros de los hooks
interface FacebookAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}

interface InstagramAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}

interface TwitterAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}

interface LinkedInAuthParams {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}

interface FacebookPostParams {
  accessToken: string;
  pageId: string;
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  title?: string;
  description?: string;
}

interface InstagramPostParams {
  accessToken: string;
  instagramAccountId: string;
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
}

interface TwitterPostParams {
  bearerToken: string;
  text: string;
  mediaUrl?: string;
}

interface TikTokPostParams {
  accessToken: string;
  videoUrl: string;
  title: string;
  description: string;
}

interface LinkedInPostParams {
  accessToken: string;
  urn: string;
  imageUrl: string;
  title: string;
  description: string;
}

interface PostStatsParams {
  accessToken: string;
  postId: string;
}

/**
 * Hook para autenticación con Facebook
 */
export const useFacebookAuth = () => {
  const getAccessToken = async (params: FacebookAuthParams) => {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: params.clientId,
          client_secret: params.clientSecret,
          redirect_uri: params.redirectUri,
          code: params.code,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new Error(`Error al obtener token de acceso de Facebook: ${error.message}`);
    }
  };

  const getPages = async (accessToken: string) => {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: {
          access_token: accessToken,
        },
      });

      return response.data.data.map(page => ({
        id: page.id,
        name: page.name,
        category: page.category,
        accessToken: page.access_token,
      }));
    } catch (error) {
      throw new Error(`Error al obtener páginas de Facebook: ${error.message}`);
    }
  };

  return { getAccessToken, getPages };
};

/**
 * Hook para autenticación con Instagram
 */
export const useInstagramAuth = () => {
  const getAccessToken = async (params: InstagramAuthParams) => {
    try {
      // Instagram usa el mismo endpoint que Facebook para OAuth
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: params.clientId,
          client_secret: params.clientSecret,
          redirect_uri: params.redirectUri,
          code: params.code,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new Error(`Error al obtener token de acceso de Instagram: ${error.message}`);
    }
  };

  const getAccounts = async (accessToken: string) => {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
        params: {
          access_token: accessToken,
          fields: 'instagram_business_account',
        },
      });

      const accounts = [];
      for (const page of response.data.data) {
        if (page.instagram_business_account) {
          accounts.push({
            pageId: page.id,
            pageName: page.name,
            instagramAccountId: page.instagram_business_account.id,
          });
        }
      }

      return accounts;
    } catch (error) {
      throw new Error(`Error al obtener cuentas de Instagram: ${error.message}`);
    }
  };

  return { getAccessToken, getAccounts };
};

/**
 * Hook para autenticación con Twitter
 */
export const useTwitterAuth = () => {
  const getAccessToken = async (params: TwitterAuthParams) => {
    try {
      const credentials = Buffer.from(`${params.clientId}:${params.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: params.clientId,
          code: params.code,
          redirect_uri: params.redirectUri,
          code_verifier: params.codeVerifier,
        }),
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      throw new Error(`Error al obtener token de acceso de Twitter: ${error.message}`);
    }
  };

  return { getAccessToken };
};

/**
 * Hook para autenticación con LinkedIn
 */
export const useLinkedInAuth = () => {
  const getAccessToken = async (params: LinkedInAuthParams) => {
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: params.redirectUri,
          client_id: params.clientId,
          client_secret: params.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        refreshToken: response.data.refresh_token,
        refreshTokenExpiresIn: response.data.refresh_token_expires_in,
      };
    } catch (error) {
      throw new Error(`Error al obtener token de acceso de LinkedIn: ${error.message}`);
    }
  };

  const getProfile = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.id,
        firstName: response.data.localizedFirstName,
        lastName: response.data.localizedLastName,
        profilePicture: response.data.profilePicture?.displayImage,
      };
    } catch (error) {
      throw new Error(`Error al obtener perfil de LinkedIn: ${error.message}`);
    }
  };

  const getOrganizations = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/organizationAcls', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          q: 'roleAssignee',
          projection: '(elements*(organization~(localizedName,logoV2(original~:playableStreams))))',
        },
      });

      return response.data.elements.map(org => ({
        organizationId: org.organization,
        organizationName: org['organization~'].localizedName,
        logo: org['organization~'].logoV2?.['original~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      }));
    } catch (error) {
      throw new Error(`Error al obtener organizaciones de LinkedIn: ${error.message}`);
    }
  };

  return { getAccessToken, getProfile, getOrganizations };
};

/**
 * Hook para publicar en Facebook
 */
export const useFacebookPost = () => {
  const postImage = async (params: FacebookPostParams) => {
    try {
      if (!params.imageUrl) {
        throw new Error('Se requiere una URL de imagen para publicar en Facebook');
      }

      const response = await axios.post(`https://graph.facebook.com/v18.0/${params.pageId}/photos`, null, {
        params: {
          url: params.imageUrl,
          caption: params.caption,
          access_token: params.accessToken,
        },
      });

      return {
        success: true,
        postId: response.data.post_id,
        message: 'Imagen publicada exitosamente en Facebook',
      };
    } catch (error) {
      throw new Error(`Error al publicar imagen en Facebook: ${error.message}`);
    }
  };

  const postVideo = async (params: FacebookPostParams) => {
    try {
      if (!params.videoUrl) {
        throw new Error('Se requiere una URL de video para publicar en Facebook');
      }

      const response = await axios.post(`https://graph.facebook.com/v18.0/${params.pageId}/videos`, null, {
        params: {
          file_url: params.videoUrl,
          title: params.title,
          description: params.description,
          access_token: params.accessToken,
        },
      });

      return {
        success: true,
        videoId: response.data.id,
        message: 'Video publicado exitosamente en Facebook',
      };
    } catch (error) {
      throw new Error(`Error al publicar video en Facebook: ${error.message}`);
    }
  };

  return { postImage, postVideo };
};

/**
 * Hook para publicar en Instagram
 */
export const useInstagramPost = () => {
  const postImage = async (params: InstagramPostParams) => {
    try {
      if (!params.imageUrl) {
        throw new Error('Se requiere una URL de imagen para publicar en Instagram');
      }

      // Primero creamos el contenedor de medios
      const containerResponse = await axios.post(
        `https://graph.instagram.com/v18.0/${params.instagramAccountId}/media`,
        null,
        {
          params: {
            image_url: params.imageUrl,
            caption: params.caption,
            access_token: params.accessToken,
          },
        }
      );

      const creationId = containerResponse.data.id;

      // Luego publicamos el contenedor
      const publishResponse = await axios.post(
        `https://graph.instagram.com/v18.0/${params.instagramAccountId}/media_publish`,
        null,
        {
          params: {
            creation_id: creationId,
            access_token: params.accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId: publishResponse.data.id,
        message: 'Imagen publicada exitosamente en Instagram',
      };
    } catch (error) {
      throw new Error(`Error al publicar imagen en Instagram: ${error.message}`);
    }
  };

  const postVideo = async (params: InstagramPostParams) => {
    try {
      if (!params.videoUrl) {
        throw new Error('Se requiere una URL de video para publicar en Instagram');
      }

      // Creamos el contenedor de video
      const containerResponse = await axios.post(
        `https://graph.instagram.com/v18.0/${params.instagramAccountId}/media`,
        null,
        {
          params: {
            media_type: 'VIDEO',
            video_url: params.videoUrl,
            caption: params.caption,
            access_token: params.accessToken,
          },
        }
      );

      const creationId = containerResponse.data.id;

      // Publicamos el contenedor
      const publishResponse = await axios.post(
        `https://graph.instagram.com/v18.0/${params.instagramAccountId}/media_publish`,
        null,
        {
          params: {
            creation_id: creationId,
            access_token: params.accessToken,
          },
        }
      );

      return {
        success: true,
        mediaId: publishResponse.data.id,
        message: 'Video publicado exitosamente en Instagram',
      };
    } catch (error) {
      throw new Error(`Error al publicar video en Instagram: ${error.message}`);
    }
  };

  return { postImage, postVideo };
};

/**
 * Hook para publicar en Twitter
 */
export const useTwitterPost = () => {
  const postTweet = async (params: TwitterPostParams) => {
    try {
      const payload: any = { text: params.text };

      // Si hay una imagen, la incluimos en la publicación
      if (params.mediaUrl) {
        payload.media = {
          media_entities: [
            {
              media_url: params.mediaUrl,
            },
          ],
        };
      }

      const response = await axios.post('https://api.twitter.com/2/tweets', payload, {
        headers: {
          'Authorization': `Bearer ${params.bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        tweetId: response.data.data.id,
        message: 'Tweet publicado exitosamente',
      };
    } catch (error) {
      throw new Error(`Error al publicar en Twitter: ${error.message}`);
    }
  };

  return { postTweet };
};

/**
 * Hook para publicar en TikTok
 */
export const useTikTokPost = () => {
  const postVideo = async (params: TikTokPostParams) => {
    try {
      const payload = {
        video_url: params.videoUrl,
        title: params.title,
        description: params.description,
        access_token: params.accessToken,
      };

      const response = await axios.post('https://open-api.tiktok.com/video/upload', payload);

      return {
        success: true,
        videoId: response.data.data.video_id,
        message: 'Video publicado exitosamente en TikTok',
      };
    } catch (error) {
      throw new Error(`Error al publicar en TikTok: ${error.message}`);
    }
  };

  return { postVideo };
};

/**
 * Hook para publicar en LinkedIn
 */
export const useLinkedInPost = () => {
  const postImage = async (params: LinkedInPostParams) => {
    try {
      const payload = {
        author: params.urn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: params.description,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                description: {
                  text: params.description,
                },
                media: params.imageUrl,
                title: {
                  text: params.title,
                },
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', payload, {
        headers: {
          'Authorization': `Bearer ${params.accessToken}`,
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
      throw new Error(`Error al publicar imagen en LinkedIn: ${error.message}`);
    }
  };

  return { postImage };
};

/**
 * Hook para obtener estadísticas de publicaciones
 */
export const usePostStats = () => {
  const getFacebookStats = async (params: PostStatsParams) => {
    try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${params.postId}`, {
        params: {
          fields: 'engagement,shares,comments.summary(true),likes.summary(true)',
          access_token: params.accessToken,
        },
      });

      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de Facebook: ${error.message}`);
    }
  };

  const getInstagramStats = async (params: PostStatsParams) => {
    try {
      const response = await axios.get(`https://graph.instagram.com/v18.0/${params.postId}`, {
        params: {
          fields: 'like_count,comments_count,engagement',
          access_token: params.accessToken,
        },
      });

      return {
        success: true,
        stats: response.data,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de Instagram: ${error.message}`);
    }
  };

  const getTwitterStats = async (bearerToken: string, tweetId: string) => {
    try {
      const response = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, {
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
      throw new Error(`Error al obtener estadísticas de Twitter: ${error.message}`);
    }
  };

  return { getFacebookStats, getInstagramStats, getTwitterStats };
};