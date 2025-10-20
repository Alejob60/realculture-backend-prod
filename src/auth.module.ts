import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './infrastructure/services/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { AuthController } from './interfaces/controllers/auth.controller';
import { ApiKeyController } from './interfaces/controllers/api-key.controller';
import { ConfigController } from './interfaces/controllers/config.controller';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './infrastructure/modules/user.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { ApiKeyService } from './infrastructure/services/api-key.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController, ApiKeyController, ConfigController],
  providers: [AuthService, JwtStrategy, LoginUseCase, ApiKeyService],
  exports: [AuthService, JwtModule, ApiKeyService],
})
export class AuthModule {}