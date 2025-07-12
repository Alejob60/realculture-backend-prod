import { Controller, Post, Req, Body, UnauthorizedException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request } from 'express';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { UserService } from '../../infrastructure/services/user.service';
import { ContentService } from '../../infrastructure/services/content.service';
import { AzureBlobService } from '../../infrastructure/services/azure-blob.services';

@Controller('api/promo-image')
export class PromoImageController {
  private readonly logger = new Logger(PromoImageController.name);

  constructor(
    private readonly mediaBridge: MediaBridgeService,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly azureBlobService: AzureBlobService, // Inyectamos el servicio de Azure Blob
  ) {}

  @Post()
  async generatePromoImage(@Body() body: any, @Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req['user']?.userId;

    if (!token || !userId) {
      throw new UnauthorizedException('Token inválido o usuario no identificado');
    }

    const user = await this.userService.findById(userId);
    const userPlan = user?.role || 'FREE';  // Usamos FREE por defecto
    const requiredCredits = 10;  // Supón que 10 créditos por imagen

    if (!user || user.credits < requiredCredits) {
      throw new HttpException('Créditos insuficientes', HttpStatus.FORBIDDEN);
    }

    // Establecer textOverlay en false si no se pasa como parámetro
    const textOverlay = body.textOverlay ?? false;

    const payload = {
      prompt: body.prompt,
      plan: userPlan,
      textOverlay: textOverlay,
    };

    this.logger.log(`🎯 Enviando generación de imagen a video-generator con payload: ${JSON.stringify(payload)}`);

    // Llamar al microservicio mediante MediaBridge para generar la imagen
    const result = await this.mediaBridge.generatePromoImage(payload);

    if (!result || !result.success || !result.result?.imageUrl) {
      throw new HttpException('No se pudo generar la imagen correctamente', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Descontamos los créditos del usuario
    user.credits -= requiredCredits;
    await this.userService.save(user);

    // Generamos el SAS URL
    const signedUrl = await this.azureBlobService.getSignedUrl({
      filename: result.result.filename,
      container: 'images',
      expiresInSeconds: userPlan === 'FREE' ? 86400 : 2592000, // 24h para FREE, 30 días para otros planes
    });

    // Guardamos la imagen generada en la base de datos
    await this.contentService.save({
      userId,
      type: 'image',
      prompt: result.result.prompt,
      url: signedUrl,
      status: 'success',
      createdAt: new Date(),
    });

    return {
      success: true,
      message: '✅ Imagen generada correctamente',
      result: { ...result.result, signedUrl },  // Agregamos el SAS URL a la respuesta
      credits: user.credits,
    };
  }
}
