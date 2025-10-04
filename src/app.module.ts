import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth.module';
import { ContentModule } from './infrastructure/modules/content.module';
import { HealthController } from './interfaces/controllers/health.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './infrastructure/modules/user.module';
import { AiModule } from './infrastructure/modules/ai.module';
import { InfluencerModule } from './infrastructure/modules/influencer.module';
import { MediaModule } from './infrastructure/modules/media.module';
import { AudioModule } from './infrastructure/modules/audio.module';

// Import all entities
import { UserEntity } from './domain/entities/user.entity';
import { Content } from './domain/entities/content.entity';
import { InfluencerEntity } from './domain/entities/influencer.entity';
import { GeneratedVideoEntity } from './domain/entities/generated-video.entity';
import { GeneratedMusicEntity } from './domain/entities/generated-music.entity';
import { GeneratedImageEntity } from './domain/entities/generated-image.entity';
import { GeneratedAudioEntity } from './domain/entities/generated-audio.entity';
<<<<<<< Updated upstream
import { Product } from './domain/entities/product.entity';
import { Creator } from './domain/entities/creator.entity';
=======
import { GeneratedMusicEntity } from './domain/entities/generated-music.entity';
import { GeneratedVideoEntity } from './domain/entities/generated-video.entity';
// 🧩 Módulos
import { AuthModule } from './auth.module';
import { ContentModule } from './infrastructure/modules/content.module';
import { SocialMediaModule } from './infrastructure/modules/social-media.module';
import { SocialAuthModule } from './infrastructure/modules/social-auth.module';

// 🧩 Controladores
import { RagController } from './interfaces/controllers/rag.controller';
import { ContentController } from './interfaces/controllers/content.controller';
import { AiController } from './interfaces/controllers/ai.controller';
import { InfluencerController } from './interfaces/controllers/influencer.controller';
import { UserController } from './interfaces/controllers/user.controller';
import { MediaController } from './interfaces/controllers/media.controller';
import { PromoImageController } from './interfaces/controllers/promo-image.controller';
import { GalleryController } from './interfaces/controllers/gallery.controller';
import { AudioController } from './interfaces/controllers/audio.controller';
import { HealthController } from './interfaces/controllers/health.controller';
import { PaymentsController } from './interfaces/controllers/payment.controller';
import {VideoController} from './interfaces/controllers/video-controller';
import { SocialMediaController } from './interfaces/controllers/social-media.controller';
import { SocialMediaBulkController } from './interfaces/controllers/social-media-bulk.controller';
import { SocialAuthController } from './interfaces/controllers/social-auth.controller';
// 🧩 Casos de uso
import { GenerateRagResponseUseCase } from './application/use-cases/generate-rag-response.use-case';
import { UseServiceUseCase } from './application/use-cases/use-service.use-case';
import { ContentUseCase } from './application/use-cases/content.use-case';
import { SocialMediaUseCase } from './application/use-cases/social-media.use-case';

// 🧩 Servicios
import { RagService } from './infrastructure/services/rag.service';
import { ContentService } from './infrastructure/services/content.service';
import { AiService } from './infrastructure/services/ai.service';
import { UserService } from './infrastructure/services/user.service';
import { GeneratedImageService } from './infrastructure/services/generated-image.service';
import { GalleryService } from './infrastructure/services/gallery.service';
import { MediaBridgeService } from './infrastructure/services/media-bridge.service';
import { AzureBlobService } from './infrastructure/services/azure-blob.services';
import { WompiService } from './infrastructure/services/wompi.service';  // Asegúrate de importar el servicio Wompi
import { SocialMediaService } from './infrastructure/services/social-media.service';
import { SocialAuthService } from './infrastructure/services/social-auth.service';

// 🧩 Repositorios
import { ContentRepository } from './infrastructure/database/content.repository';
import { InfluencerRepository } from './infrastructure/database/influencer.repository';
import { UserRepository } from './infrastructure/database/user.repository';

// 🧩 Estrategias
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
>>>>>>> Stashed changes

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          UserEntity,
          Content,
          InfluencerEntity,
          GeneratedVideoEntity,
          GeneratedMusicEntity,
          GeneratedImageEntity,
          GeneratedAudioEntity,
          Product,
          Creator,
        ],
        synchronize: false,
        logging: true,
        migrations: ['dist/migrations/*.js'],
        // --- AÑADIR ESTA SECCIÓN PARA HABILITAR SSL ---
        ssl: {
          rejectUnauthorized: false,
        },
        // -------------------------------------------
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    HttpModule,
    ContentModule,
<<<<<<< Updated upstream
    DatabaseModule,
    UserModule,
    AiModule,
    InfluencerModule,
    MediaModule,
    AudioModule,
  ],
  controllers: [HealthController],
  providers: [],
  exports: [],
=======
    SocialMediaModule,
    SocialAuthModule,
  ],

  controllers: [
    RagController,
    ContentController,
    AiController,
    InfluencerController,
    UserController,
    MediaController,
    PromoImageController,
    GalleryController,
    AudioController,
    HealthController,
    PaymentsController,
    VideoController,  // Asegúrate de agregar el controlador de video
    SocialMediaController,
    SocialMediaBulkController,
    SocialAuthController,
  ],

  providers: [
    JwtStrategy,
    RagService,
    GenerateRagResponseUseCase,
    ContentService,
    AiService,
    UserService,
    MediaBridgeService,
    UseServiceUseCase,
    GeneratedImageService,
    GalleryService,
    ContentUseCase,
    AzureBlobService,
    WompiService,  // Agregado WompiService a los providers
    SocialMediaService,
    SocialAuthService,
    SocialMediaUseCase,

    {
      provide: ContentRepository,
      useFactory: (contentRepo: Repository<Content>, userRepo: Repository<UserEntity>) => {
        return new ContentRepository(contentRepo, userRepo); // Pasamos ambos repositorios al constructor
      },
      inject: [getRepositoryToken(Content), getRepositoryToken(UserEntity)],
    },
    {
      provide: InfluencerRepository,
      useFactory: (repo: Repository<InfluencerEntity>) => new InfluencerRepository(repo),
      inject: [getRepositoryToken(InfluencerEntity)],
    },
    {
      provide: UserRepository,
      useFactory: (repo: Repository<UserEntity>) => new UserRepository(repo),
      inject: [getRepositoryToken(UserEntity)],
    },
  ],

  exports: [AzureBlobService,ContentRepository],
>>>>>>> Stashed changes
})
export class AppModule {}
