import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SocialAuthService {
  private readonly logger = new Logger(SocialAuthService.name);

  /**
   * Obtiene el token de acceso de Facebook usando el código de autorización
   */
  async getFacebookAccessToken(clientId: string, clientSecret: string, redirectUri: string, code: string) {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de Facebook:', error.message);
      throw new Error(`Error al obtener token de acceso de Facebook: ${error.message}`);
    }
  }

  /**
   * Obtiene las páginas de Facebook a las que el usuario tiene acceso
   */
  async getFacebookPages(accessToken: string) {
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
      this.logger.error('Error al obtener páginas de Facebook:', error.message);
      throw new Error(`Error al obtener páginas de Facebook: ${error.message}`);
    }
  }

  /**
   * Obtiene el token de acceso de Instagram
   */
  async getInstagramAccessToken(clientId: string, clientSecret: string, redirectUri: string, code: string) {
    try {
      // Instagram usa el mismo endpoint que Facebook para OAuth
      const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de Instagram:', error.message);
      throw new Error(`Error al obtener token de acceso de Instagram: ${error.message}`);
    }
  }

  /**
   * Obtiene las cuentas de Instagram conectadas a páginas de Facebook
   */
  async getInstagramAccounts(accessToken: string) {
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
      this.logger.error('Error al obtener cuentas de Instagram:', error.message);
      throw new Error(`Error al obtener cuentas de Instagram: ${error.message}`);
    }
  }

  /**
   * Obtiene el token de acceso de Twitter usando el código de autorización
   */
  async getTwitterAccessToken(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    code: string,
    codeVerifier: string,
  ) {
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const response = await axios.post(
        'https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
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
      this.logger.error('Error al obtener token de acceso de Twitter:', error.message);
      throw new Error(`Error al obtener token de acceso de Twitter: ${error.message}`);
    }
  }

  /**
   * Obtiene el token de acceso de LinkedIn usando el código de autorización
   */
  async getLinkedInAccessToken(clientId: string, clientSecret: string, redirectUri: string, code: string) {
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
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
      this.logger.error('Error al obtener token de acceso de LinkedIn:', error.message);
      throw new Error(`Error al obtener token de acceso de LinkedIn: ${error.message}`);
    }
  }

  /**
   * Obtiene el perfil del usuario en LinkedIn
   */
  async getLinkedInProfile(accessToken: string) {
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
      this.logger.error('Error al obtener perfil de LinkedIn:', error.message);
      throw new Error(`Error al obtener perfil de LinkedIn: ${error.message}`);
    }
  }

  /**
   * Obtiene las organizaciones de LinkedIn a las que el usuario tiene acceso
   */
  async getLinkedInOrganizations(accessToken: string) {
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
      this.logger.error('Error al obtener organizaciones de LinkedIn:', error.message);
      throw new Error(`Error al obtener organizaciones de LinkedIn: ${error.message}`);
    }
  }
}