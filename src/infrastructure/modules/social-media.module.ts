import { Module } from '@nestjs/common';
import { SocialMediaService } from '../services/social-media.service';
import { SocialMediaController } from '../../interfaces/controllers/social-media.controller';
import { SocialMediaUseCase } from '../../application/use-cases/social-media.use-case';
import { SocialMediaBulkController } from '../../interfaces/controllers/social-media-bulk.controller';
import { ContentService } from '../services/content.service';
import { ContentRepository } from '../database/content.repository';
import { UserRepository } from '../database/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../../domain/entities/content.entity';
import { UserEntity } from '../../domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, UserEntity]),
  ],
  controllers: [SocialMediaController, SocialMediaBulkController],
  providers: [
    SocialMediaService,
    SocialMediaUseCase,
    ContentService,
    ContentRepository,
    UserRepository,
  ],
  exports: [SocialMediaService, SocialMediaUseCase],
})
export class SocialMediaModule {}