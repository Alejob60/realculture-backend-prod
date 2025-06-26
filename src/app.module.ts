import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Repository } from 'typeorm';

// 🧩 Entidades
import { UserEntity } from './domain/entities/user.entity';
import { Content } from './domain/entities/content.entity';
import { InfluencerEntity } from './domain/entities/influencer.entity';
import { Product } from './domain/entities/product.entity';
import { GeneratedImageEntity } from './domain/entities/generated-image.entity';
import { GeneratedAudioEntity } from './domain/entities/generated-audio.entity';
import { GeneratedMusicEntity } from './domain/entities/generated-music.entity';
import { GeneratedVideoEntity } from './domain/entities/generated-video.entity';

// 🧩 Módulos
import { AuthModule } from './auth.module';
import { ContentModule } from './infrastructure/modules/content.module';

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

// 🧩 Casos de uso
import { GenerateRagResponseUseCase } from './application/use-cases/generate-rag-response.use-case';
import { UseServiceUseCase } from './application/use-cases/use-service.use-case';
import { ContentUseCase } from './application/use-cases/content.use-case';

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

// 🧩 Repositorios
import { ContentRepository } from './infrastructure/database/content.repository';
import { InfluencerRepository } from './infrastructure/database/influencer.repository';
import { UserRepository } from './infrastructure/database/user.repository';

// 🧩 Estrategias
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        try {
          console.log('🔧 Cargando configuración de TypeORM con variables:');
          return {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            synchronize: false,
            autoLoadEntities: true,
          };
        } catch (error) {
          console.error('Error al cargar la configuración de TypeORM:', error);
          throw new Error('Error al cargar la configuración de TypeORM');
        }
      },
    }),

    TypeOrmModule.forFeature([
      UserEntity,
      Content,
      InfluencerEntity,
      Product,
      GeneratedImageEntity,
      GeneratedAudioEntity,
      GeneratedMusicEntity,
      GeneratedVideoEntity,
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-dev',
      signOptions: { expiresIn: '1d' },
    }),

    AuthModule,
    HttpModule,
    ContentModule,
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

    {
      provide: ContentRepository,
      useFactory: (repo: Repository<Content>) => new ContentRepository(repo),
      inject: [getRepositoryToken(Content)],
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

  exports: [AzureBlobService],
})
export class AppModule {}
