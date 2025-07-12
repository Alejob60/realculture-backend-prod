import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { UserService } from '../../infrastructure/services/user.service';
import { GeneratedImageService } from '../../infrastructure/services/generated-image.service';
import { ContentService } from '../../infrastructure/services/content.service';
import { AzureBlobService } from '../../infrastructure/services/azure-blob.services';

@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(
    private readonly mediaBridgeService: MediaBridgeService,
    private readonly userService: UserService,
    private readonly imageService: GeneratedImageService,
    private readonly contentService: ContentService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  private extractUserData(req: Request): { userId: string; token: string } {
    const userId = req.user?.['userId'] || (req.user as any)?.sub;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!userId || !token) {
      throw new UnauthorizedException('Usuario no autenticado o token no encontrado');
    }
    return { userId, token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  async generateImage(@Body() body: any, @Req() req: Request) {
    const { userId, token } = this.extractUserData(req);

    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const plan = user.role?.toUpperCase?.() || 'FREE';
    const requiredCredits = 10;

    if (user.credits < requiredCredits) {
      throw new HttpException('Créditos insuficientes', HttpStatus.FORBIDDEN);
    }

    // ⚠️ Validar tipo booleano si viene textOverlay
    if (body.textOverlay !== undefined && typeof body.textOverlay !== 'boolean') {
      throw new HttpException(
        'El campo textOverlay debe ser booleano si se incluye',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: any = {
      prompt: body.prompt,
      plan,
    };

    if (body.textOverlay !== undefined) {
      payload.textOverlay = body.textOverlay;
    }

    // 🔁 Llamar al microservicio para generar la imagen
    const result = await this.mediaBridgeService.generatePromoImage(payload);

    if (!result || !result.success || !result.result?.imageUrl) {
      throw new HttpException('No se pudo generar la imagen correctamente', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Descontar créditos del usuario
    user.credits -= requiredCredits;
    await this.userService.save(user);

    // Obtener la URL SAS para la imagen generada
    const signedUrl = await this.azureBlobService.getSignedUrl({
      filename: result.result.filename, // Asegúrate que "filename" esté presente en el resultado
      container: 'images',
      expiresInSeconds: 86400, // 24 horas
    });

    // Guardar la imagen en la base de datos
    await this.contentService.save({
      userId,
      type: 'image',
      prompt: result.result.prompt,
      url: signedUrl, // Usamos la URL SAS aquí
      status: 'success',
      createdAt: new Date(),
    });

    return {
      success: true,
      message: '✅ Imagen generada correctamente',
      result: {
        ...result.result,
        url: signedUrl, // Asegúrate que devolvamos la URL firmada
      },
      credits: user.credits,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/signed-image/:filename')
  async getSignedImageUrl(@Param('filename') filename: string) {
    try {
      // Llamar a la función getSignedUrl para obtener la URL con el SAS
      const signedUrl = await this.azureBlobService.getSignedUrl({
        filename,
        container: 'images', // El contenedor de Azure Blob Storage donde se almacenan las imágenes
        expiresInSeconds: 86400, // 1 día
      });

      // Devolver la URL firmada al frontend
      return { url: signedUrl };
    } catch (error) {
      // Si hay algún error en la obtención de la URL firmada, lanzar una excepción
      throw new HttpException('Error al generar la URL firmada', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
