// src/interfaces/controllers/promo-image.controller.ts

import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { UserService } from '../../infrastructure/services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ContentService } from '../../infrastructure/services/content.service';

const PLAN_CREDITS = {
  'promo-image': {
    FREE: 10,
    CREATOR: 15,
    PRO: 10,
  },
};

@Controller('api/promo-image')
export class PromoImageController {
  private readonly logger = new Logger(PromoImageController.name);

  constructor(
    private readonly mediaBridge: MediaBridgeService,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generatePromoImage(@Body() body: any, @Req() req: Request) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = (req as any).user?.userId;

    if (!token || !userId) {
      throw new HttpException(
        'Token inválido o usuario no identificado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findById(userId);
    const userPlan = user?.role || 'FREE';
    const serviceKey = 'promo-image';
    const requiredCredits = PLAN_CREDITS[serviceKey]?.[userPlan] ?? null;

    if (requiredCredits === null) {
      throw new HttpException(
        'Tu plan no permite generar imágenes promocionales',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user || user.credits < requiredCredits) {
      throw new HttpException('Créditos insuficientes', HttpStatus.FORBIDDEN);
    }

    // ✅ Validación segura para textOverlay
    if (body.textOverlay !== undefined && typeof body.textOverlay !== 'boolean') {
      throw new HttpException(
        'El campo textOverlay debe ser booleano',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ✅ Preparar payload con campos permitidos
    const payload: any = {
      prompt: body.prompt,
      plan: userPlan,
    };

    if (body.textOverlay !== undefined) {
      payload.textOverlay = body.textOverlay;
    }

    this.logger.log(`🎯 Enviando generación de imagen a video-generator con payload: ${JSON.stringify(payload)}`);

    // ✅ Llamar al microservicio mediante MediaBridge
    const result = await this.mediaBridge.generatePromoImage(payload);

    // ✅ Validar y descontar créditos
    const updatedUser = await this.userService.decrementCredits(userId, requiredCredits);
    if (!updatedUser) {
      throw new NotFoundException('No se pudo actualizar los créditos del usuario');
    }

    // ✅ Guardar en historial de contenido
    await this.contentService.save({
      userId,
      type: 'image',
      prompt: result?.result?.prompt || 'Sin descripción',
      url: result?.result?.imageUrl,
      status: 'success',
      createdAt: new Date(result?.result?.createdAt || Date.now()),
    });

    return {
      ...(result || {}),
      credits: updatedUser.credits,
    };
  }
}
