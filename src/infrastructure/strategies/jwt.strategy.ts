// src/infrastructure/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    if (!configService.get<string>('JWT_SECRET')) {
      throw new Error('❌ JWT_SECRET no está definido en las variables de entorno');
    }
  }

  async validate(payload: {
    sub: string;
    email: string;
    name?: string;
    role?: string;
  }) {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Token inválido: faltan campos requeridos');
    }

    // Puedes extender este objeto según tu modelo de usuario
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name || '',
      role: payload.role || 'user',
    };
  }
}
