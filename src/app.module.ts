import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { Repository } from 'typeorm';

// Entidades
import { UserEntity } from './domain/entities/user.entity';
import { Content } from './domain/entities/content.entity';
import { InfluencerEntity } from './domain/entities/influencer.entity';
import { GeneratedVideoEntity } from './domain/entities/generated-video.entity';
import { GeneratedMusicEntity } from './domain/entities/generated-music.entity';
import { GeneratedImageEntity } from './domain/entities/generated-image.entity';
import { GeneratedAudioEntity } from './domain/entities/generated-audio.entity';
import { Creator } from './domain/entities/creator.entity';
import { MetaToken } from './domain/entities/meta-token.entity';
import { PaymentEntity } from './domain/entities/payment.entity';
import { VideoResultEntity } from './domain/entities/video-result.entity';
import { ApiKeyEntity } from './domain/entities/api-key.entity';
import { TenantEntity } from './domain/entities/tenant.entity';
import { ProductEntity } from './domain/entities/product.entity';
import { InventoryItemEntity } from './domain/entities/inventory-item.entity';
import { CartEntity } from './domain/entities/cart.entity';
import { OrderEntity } from './domain/entities/order.entity';
import { OrderItemEntity } from './domain/entities/order-item.entity';
import { WebsiteEntity } from './domain/entities/website.entity';
import { PageEntity } from './domain/entities/page.entity';
import { SectionEntity } from './domain/entities/section.entity';
import { BlockEntity } from './domain/entities/block.entity';
import { TenantContextEntity } from './domain/entities/tenant-context.entity';
import { EmbeddingEntity } from './domain/entities/embedding.entity';

// Módulos
import { AuthModule } from './auth.module';
import { ContentModule } from './infrastructure/modules/content.module';
import { SocialMediaModule } from './infrastructure/modules/social-media.module';
import { SocialAuthModule } from './infrastructure/modules/social-auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './infrastructure/modules/user.module';
import { AiModule } from './infrastructure/modules/ai.module';
import { InfluencerModule } from './infrastructure/modules/influencer.module';
import { MediaModule } from './infrastructure/modules/media.module';
import { AudioModule } from './infrastructure/modules/audio.module';
import { MetaIntegrationModule } from './infrastructure/modules/meta-integration.module';
import { WompiModule } from './infrastructure/modules/wompi.module';
import { VideoModule } from './infrastructure/modules/video.module';
import { GoogleAuthModule } from './infrastructure/modules/google-auth.module';
import { TenantModule } from './infrastructure/modules/tenant.module';
import { ProductModule } from './infrastructure/modules/product.module';
import { InventoryModule } from './infrastructure/modules/inventory.module';
import { CartModule } from './infrastructure/modules/cart.module';
import { OrderModule } from './infrastructure/modules/order.module';
import { TenantContextModule } from './infrastructure/modules/tenant-context.module';
import { EmbeddingModule } from './infrastructure/modules/embedding.module';
import { SessionModule } from './infrastructure/modules/session.module';
import { WebsiteModule } from './infrastructure/modules/website.module';
import { PageModule } from './infrastructure/modules/page.module';
import { SectionModule } from './infrastructure/modules/section.module';
import { BlockModule } from './infrastructure/modules/block.module';
import { AnalyticsModule } from './infrastructure/modules/analytics.module';
import { AzureBusModule } from './infrastructure/modules/azure-bus.module';
import { PaymentsModule } from './application/modules/payments.module';
import { PageRepository } from './infrastructure/database/page.repository';
import { SectionRepository } from './infrastructure/database/section.repository';
import { BlockRepository } from './infrastructure/database/block.repository';

// Controladores
import { AppController } from './interfaces/controllers/app.controller';
import { AppService } from './infrastructure/services/app.service';
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
import { WompiController } from './interfaces/controllers/wompi.controller';
import { SocialMediaController } from './interfaces/controllers/social-media.controller';
import { SocialMediaBulkController } from './interfaces/controllers/social-media-bulk.controller';
import { SocialAuthController } from './interfaces/controllers/social-auth.controller';
import { MetaController } from './interfaces/controllers/meta.controller';
import { PromptJsonController } from './interfaces/controllers/prompt-json.controller';
import { CreditsController } from './interfaces/controllers/credits.controller';
import { StatusController } from './interfaces/controllers/status.controller';
import { SubscriptionController } from './interfaces/controllers/subscription.controller';
import { ImageResultController } from './interfaces/controllers/image-result.controller';
import { PingController } from './interfaces/controllers/ping.controller';
import { TenantController } from './interfaces/controllers/tenant.controller';
import { ProductController } from './interfaces/controllers/product.controller';
import { InventoryController } from './interfaces/controllers/inventory.controller';
import { CartController } from './interfaces/controllers/cart.controller';
import { OrderController } from './interfaces/controllers/order.controller';
import { TenantContextController } from './interfaces/controllers/tenant-context.controller';
import { EmbeddingController } from './interfaces/controllers/embedding.controller';
import { SessionController } from './interfaces/controllers/session.controller';
import { SiteDnaController } from './interfaces/controllers/site-dna.controller';
import { MetaAgentController } from './interfaces/controllers/meta-agent.controller';
import { WebsiteController } from './interfaces/controllers/website.controller';

// Servicios
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RagService } from './infrastructure/services/rag.service';
import { GenerateRagResponseUseCase } from './application/use-cases/generate-rag-response.use-case';
import { ContentService } from './infrastructure/services/content.service';
import { AiService } from './infrastructure/services/ai.service';
import { MediaBridgeService } from './infrastructure/services/media-bridge.service';
import { UseServiceUseCase } from './application/use-cases/use-service.use-case';
import { GeneratedImageService } from './infrastructure/services/generated-image.service';
import { ContentUseCase } from './application/use-cases/content.use-case';
import { AzureBlobService } from './infrastructure/services/azure-blob.services';
import { SocialMediaService } from './infrastructure/services/social-media.service';
import { SocialAuthService } from './infrastructure/services/social-auth.service';
import { SocialMediaUseCase } from './application/use-cases/social-media.use-case';
import { HealthCheckService } from './infrastructure/services/health-check.service';
import { WompiService } from './infrastructure/services/wompi.service';
import { PaymentAgentService } from './infrastructure/services/payment-agent.service';
import { SubscriptionService } from './infrastructure/services/subscription.service';
import { GoogleAuthService } from './infrastructure/services/google-auth.service';
import { TenantService } from './infrastructure/services/tenant.service';
import { KeyVaultService } from './infrastructure/services/key-vault.service';
import { ProductService } from './infrastructure/services/product.service';
import { InventoryService } from './infrastructure/services/inventory.service';
import { CartService } from './infrastructure/services/cart.service';
import { OrderService } from './infrastructure/services/order.service';
import { TenantContextService } from './infrastructure/services/tenant-context.service';
import { SessionService } from './infrastructure/services/session.service';
import { AgentTokenService } from './infrastructure/services/agent-token.service';
import { WebsiteService } from './infrastructure/services/website.service';
import { SiteDnaExtractorService } from './infrastructure/services/site-dna-extractor.service';
import { PageService } from './infrastructure/services/page.service';
import { SectionService } from './infrastructure/services/section.service';
import { BlockService } from './infrastructure/services/block.service';
import { WebsiteStructureService } from './infrastructure/services/website-structure.service';
import { RedisService } from './infrastructure/services/redis.service';
import { RedisSessionService } from './infrastructure/services/redis-session.service';
import { SessionRecoveryService } from './infrastructure/services/session-recovery.service';
import { OrdersService } from './application/services/orders.service';

// Repositorios
import { ContentRepository } from './infrastructure/database/content.repository';
import { InfluencerRepository } from './infrastructure/database/influencer.repository';

// Middleware
import { AuthLoggingMiddleware } from './infrastructure/middleware/auth-logging.middleware';
import { TenantMiddleware } from './infrastructure/middleware/tenant.middleware';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    // Condición para solo configurar TypeORM en entornos que lo requieran
    ...(process.env.NODE_ENV !== 'production' || process.env.DB_HOST ? [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          // Solo configurar TypeORM si tenemos las variables de entorno necesarias
          if (!configService.get<string>('DB_HOST') || !configService.get<string>('DB_USERNAME')) {
            return {};
          }
          
          return {
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
              Creator,
              MetaToken,
              PaymentEntity,
              VideoResultEntity,
              ApiKeyEntity,
              TenantEntity,
              ProductEntity,
              InventoryItemEntity,
              CartEntity,
              OrderEntity,
              OrderItemEntity,
              WebsiteEntity,
              PageEntity,
              SectionEntity,
              BlockEntity,
              TenantContextEntity,
              EmbeddingEntity,
            ],
            synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true' || false,
            logging: true,
            migrations: ['dist/migrations/*.js'],
            // --- AÑADIR ESTA SECCIÓN PARA HABILITAR SSL ---
            ssl: {
              rejectUnauthorized: false,
            },
            // -------------------------------------------
          };
        },
        inject: [ConfigService],
      })
    ] : []),
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
    AzureBusModule,
    ContentModule,
    SocialMediaModule,
    SocialAuthModule,
    DatabaseModule,
    UserModule,
    AiModule,
    InfluencerModule,
    MediaModule,
    AudioModule,
    MetaIntegrationModule,
    WompiModule,
    VideoModule,
    GoogleAuthModule,
    TenantModule,
    ProductModule,
    InventoryModule,
    CartModule,
    OrderModule,
    TenantContextModule,
    EmbeddingModule,
    SessionModule,
    WebsiteModule,
    PageModule,
    SectionModule,
    BlockModule,
    AnalyticsModule,
    PaymentsModule,
    TypeOrmModule.forFeature([TenantEntity, ProductEntity, InventoryItemEntity, CartEntity, OrderEntity, OrderItemEntity, PageEntity, SectionEntity, BlockEntity]),
  ],
  controllers: [
    AppController,
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
    WompiController,
    SocialMediaController,
    SocialMediaBulkController,
    SocialAuthController,
    MetaController,
    PromptJsonController,
    CreditsController,
    StatusController,
    SubscriptionController,
    ImageResultController,
    PingController,
    TenantController,
    ProductController,
    InventoryController,
    CartController,
    OrderController,
    TenantContextController,
    EmbeddingController,
    SessionController,
    SiteDnaController,
    MetaAgentController,
    WebsiteController,
    // AuthController - Removido porque está incluido en AuthModule
  ],
  providers: [
    AppService,
    JwtStrategy,
    RagService,
    GenerateRagResponseUseCase,
    ContentService,
    AiService,
    MediaBridgeService,
    UseServiceUseCase,
    GeneratedImageService,
    ContentUseCase,
    AzureBlobService,
    SocialMediaService,
    SocialAuthService,
    SocialMediaUseCase,
    HealthCheckService,
    WompiService,
    PaymentAgentService,
    SubscriptionService,
    GoogleAuthService,
    TenantService,
    KeyVaultService,
    ProductService,
    InventoryService,
    CartService,
    OrderService,
    TenantContextService,
    AgentTokenService,
    WebsiteService,
    SiteDnaExtractorService,
    PageService,
    SectionService,
    BlockService,
    WebsiteStructureService,
    SessionRecoveryService,
    OrdersService,

    {
      provide: ContentRepository,
      useFactory: (contentRepo: Repository<Content>) => {
        return new ContentRepository(contentRepo);
      },
      inject: [getRepositoryToken(Content)],
    },
    {
      provide: InfluencerRepository,
      useFactory: (repo: Repository<InfluencerEntity>) => new InfluencerRepository(repo),
      inject: [getRepositoryToken(InfluencerEntity)],
    },
  ],
  exports: [AzureBlobService, ContentRepository, WompiService, SubscriptionService, GoogleAuthService, TenantService, KeyVaultService],
})
export class AppModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer
      .apply(AuthLoggingMiddleware)
      .forRoutes(
        { path: 'gallery/*path', method: RequestMethod.ALL },
        { path: 'media/my-images', method: RequestMethod.GET },
        { path: 'prompt-json/*path', method: RequestMethod.ALL },
        { path: 'api/payments/wompi/*path', method: RequestMethod.ALL },
        { path: 'subscriptions/*path', method: RequestMethod.ALL }
      )
      .apply(TenantMiddleware)
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });
  }
}