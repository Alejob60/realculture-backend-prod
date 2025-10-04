import { Module } from '@nestjs/common';
import { SocialAuthService } from '../services/social-auth.service';
import { SocialAuthController } from '../../interfaces/controllers/social-auth.controller';

@Module({
  controllers: [SocialAuthController],
  providers: [SocialAuthService],
  exports: [SocialAuthService],
})
export class SocialAuthModule {}