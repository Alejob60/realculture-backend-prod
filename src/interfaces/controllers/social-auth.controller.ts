import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Logger,
} from '@nestjs/common';
import { SocialAuthService } from '../../infrastructure/services/social-auth.service';

@Controller('social-auth')
export class SocialAuthController {
  private readonly logger = new Logger(SocialAuthController.name);

  constructor(private readonly socialAuthService: SocialAuthService) {}

  /**
   * Obtiene el token de acceso de Facebook
   */
  @Post('facebook/token')
  async getFacebookAccessToken(
    @Body() body: { clientId: string; clientSecret: string; redirectUri: string; code: string },
  ) {
    try {
      const { clientId, clientSecret, redirectUri, code } = body;

      if (!clientId || !clientSecret || !redirectUri || !code) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const tokenData = await this.socialAuthService.getFacebookAccessToken(clientId, clientSecret, redirectUri, code);

      return {
        success: true,
        message: 'Token de acceso de Facebook obtenido exitosamente',
        data: tokenData,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de Facebook:', error.message);
      throw new HttpException(
        `Error al obtener token de acceso de Facebook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene las páginas de Facebook del usuario
   */
  @Post('facebook/pages')
  async getFacebookPages(@Body() body: { accessToken: string }) {
    try {
      const { accessToken } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const pages = await this.socialAuthService.getFacebookPages(accessToken);

      return {
        success: true,
        message: 'Páginas de Facebook obtenidas exitosamente',
        data: pages,
      };
    } catch (error) {
      this.logger.error('Error al obtener páginas de Facebook:', error.message);
      throw new HttpException(
        `Error al obtener páginas de Facebook: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene el token de acceso de Instagram
   */
  @Post('instagram/token')
  async getInstagramAccessToken(
    @Body() body: { clientId: string; clientSecret: string; redirectUri: string; code: string },
  ) {
    try {
      const { clientId, clientSecret, redirectUri, code } = body;

      if (!clientId || !clientSecret || !redirectUri || !code) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const tokenData = await this.socialAuthService.getInstagramAccessToken(clientId, clientSecret, redirectUri, code);

      return {
        success: true,
        message: 'Token de acceso de Instagram obtenido exitosamente',
        data: tokenData,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de Instagram:', error.message);
      throw new HttpException(
        `Error al obtener token de acceso de Instagram: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene las cuentas de Instagram del usuario
   */
  @Post('instagram/accounts')
  async getInstagramAccounts(@Body() body: { accessToken: string }) {
    try {
      const { accessToken } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const accounts = await this.socialAuthService.getInstagramAccounts(accessToken);

      return {
        success: true,
        message: 'Cuentas de Instagram obtenidas exitosamente',
        data: accounts,
      };
    } catch (error) {
      this.logger.error('Error al obtener cuentas de Instagram:', error.message);
      throw new HttpException(
        `Error al obtener cuentas de Instagram: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene el token de acceso de Twitter
   */
  @Post('twitter/token')
  async getTwitterAccessToken(
    @Body() body: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      code: string;
      codeVerifier: string;
    },
  ) {
    try {
      const { clientId, clientSecret, redirectUri, code, codeVerifier } = body;

      if (!clientId || !clientSecret || !redirectUri || !code || !codeVerifier) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const tokenData = await this.socialAuthService.getTwitterAccessToken(
        clientId,
        clientSecret,
        redirectUri,
        code,
        codeVerifier,
      );

      return {
        success: true,
        message: 'Token de acceso de Twitter obtenido exitosamente',
        data: tokenData,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de Twitter:', error.message);
      throw new HttpException(
        `Error al obtener token de acceso de Twitter: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene el token de acceso de LinkedIn
   */
  @Post('linkedin/token')
  async getLinkedInAccessToken(
    @Body() body: { clientId: string; clientSecret: string; redirectUri: string; code: string },
  ) {
    try {
      const { clientId, clientSecret, redirectUri, code } = body;

      if (!clientId || !clientSecret || !redirectUri || !code) {
        throw new HttpException('Faltan parámetros requeridos', HttpStatus.BAD_REQUEST);
      }

      const tokenData = await this.socialAuthService.getLinkedInAccessToken(clientId, clientSecret, redirectUri, code);

      return {
        success: true,
        message: 'Token de acceso de LinkedIn obtenido exitosamente',
        data: tokenData,
      };
    } catch (error) {
      this.logger.error('Error al obtener token de acceso de LinkedIn:', error.message);
      throw new HttpException(
        `Error al obtener token de acceso de LinkedIn: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene el perfil del usuario en LinkedIn
   */
  @Post('linkedin/profile')
  async getLinkedInProfile(@Body() body: { accessToken: string }) {
    try {
      const { accessToken } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const profile = await this.socialAuthService.getLinkedInProfile(accessToken);

      return {
        success: true,
        message: 'Perfil de LinkedIn obtenido exitosamente',
        data: profile,
      };
    } catch (error) {
      this.logger.error('Error al obtener perfil de LinkedIn:', error.message);
      throw new HttpException(
        `Error al obtener perfil de LinkedIn: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene las organizaciones de LinkedIn del usuario
   */
  @Post('linkedin/organizations')
  async getLinkedInOrganizations(@Body() body: { accessToken: string }) {
    try {
      const { accessToken } = body;

      if (!accessToken) {
        throw new HttpException('Token de acceso no proporcionado', HttpStatus.BAD_REQUEST);
      }

      const organizations = await this.socialAuthService.getLinkedInOrganizations(accessToken);

      return {
        success: true,
        message: 'Organizaciones de LinkedIn obtenidas exitosamente',
        data: organizations,
      };
    } catch (error) {
      this.logger.error('Error al obtener organizaciones de LinkedIn:', error.message);
      throw new HttpException(
        `Error al obtener organizaciones de LinkedIn: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}