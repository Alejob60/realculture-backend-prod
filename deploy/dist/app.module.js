"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const user_entity_1 = require("./domain/entities/user.entity");
const content_entity_1 = require("./domain/entities/content.entity");
const influencer_entity_1 = require("./domain/entities/influencer.entity");
const product_entity_1 = require("./domain/entities/product.entity");
const generated_image_entity_1 = require("./domain/entities/generated-image.entity");
const generated_audio_entity_1 = require("./domain/entities/generated-audio.entity");
const generated_music_entity_1 = require("./domain/entities/generated-music.entity");
const generated_video_entity_1 = require("./domain/entities/generated-video.entity");
const auth_module_1 = require("./auth.module");
const content_module_1 = require("./infrastructure/modules/content.module");
const rag_controller_1 = require("./interfaces/controllers/rag.controller");
const content_controller_1 = require("./interfaces/controllers/content.controller");
const ai_controller_1 = require("./interfaces/controllers/ai.controller");
const influencer_controller_1 = require("./interfaces/controllers/influencer.controller");
const user_controller_1 = require("./interfaces/controllers/user.controller");
const media_controller_1 = require("./interfaces/controllers/media.controller");
const promo_image_controller_1 = require("./interfaces/controllers/promo-image.controller");
const gallery_controller_1 = require("./interfaces/controllers/gallery.controller");
const audio_controller_1 = require("./interfaces/controllers/audio.controller");
const health_controller_1 = require("./interfaces/controllers/health.controller");
const generate_rag_response_use_case_1 = require("./application/use-cases/generate-rag-response.use-case");
const use_service_use_case_1 = require("./application/use-cases/use-service.use-case");
const content_use_case_1 = require("./application/use-cases/content.use-case");
const rag_service_1 = require("./infrastructure/services/rag.service");
const content_service_1 = require("./infrastructure/services/content.service");
const ai_service_1 = require("./infrastructure/services/ai.service");
const user_service_1 = require("./infrastructure/services/user.service");
const generated_image_service_1 = require("./infrastructure/services/generated-image.service");
const gallery_service_1 = require("./infrastructure/services/gallery.service");
const media_bridge_service_1 = require("./infrastructure/services/media-bridge.service");
const azure_blob_services_1 = require("./infrastructure/services/azure-blob.services");
const content_repository_1 = require("./infrastructure/database/content.repository");
const influencer_repository_1 = require("./infrastructure/database/influencer.repository");
const user_repository_1 = require("./infrastructure/database/user.repository");
const jwt_strategy_1 = require("./infrastructure/strategies/jwt.strategy");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432', 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                synchronize: true,
                entities: [
                    user_entity_1.UserEntity,
                    content_entity_1.Content,
                    influencer_entity_1.InfluencerEntity,
                    product_entity_1.Product,
                    generated_image_entity_1.GeneratedImageEntity,
                    generated_audio_entity_1.GeneratedAudioEntity,
                    generated_music_entity_1.GeneratedMusicEntity,
                    generated_video_entity_1.GeneratedVideoEntity,
                ],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                content_entity_1.Content,
                influencer_entity_1.InfluencerEntity,
                product_entity_1.Product,
                generated_image_entity_1.GeneratedImageEntity,
                generated_audio_entity_1.GeneratedAudioEntity,
                generated_music_entity_1.GeneratedMusicEntity,
                generated_video_entity_1.GeneratedVideoEntity,
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'secret-dev',
                signOptions: { expiresIn: '1d' },
            }),
            auth_module_1.AuthModule,
            axios_1.HttpModule,
            content_module_1.ContentModule,
        ],
        controllers: [
            rag_controller_1.RagController,
            content_controller_1.ContentController,
            ai_controller_1.AiController,
            influencer_controller_1.InfluencerController,
            user_controller_1.UserController,
            media_controller_1.MediaController,
            promo_image_controller_1.PromoImageController,
            gallery_controller_1.GalleryController,
            audio_controller_1.AudioController,
            health_controller_1.HealthController,
        ],
        providers: [
            jwt_strategy_1.JwtStrategy,
            rag_service_1.RagService,
            generate_rag_response_use_case_1.GenerateRagResponseUseCase,
            content_service_1.ContentService,
            ai_service_1.AiService,
            user_service_1.UserService,
            media_bridge_service_1.MediaBridgeService,
            use_service_use_case_1.UseServiceUseCase,
            generated_image_service_1.GeneratedImageService,
            gallery_service_1.GalleryService,
            content_use_case_1.ContentUseCase,
            azure_blob_services_1.AzureBlobService,
            {
                provide: content_repository_1.ContentRepository,
                useFactory: (repo) => new content_repository_1.ContentRepository(repo),
                inject: [(0, typeorm_1.getRepositoryToken)(content_entity_1.Content)],
            },
            {
                provide: influencer_repository_1.InfluencerRepository,
                useFactory: (repo) => new influencer_repository_1.InfluencerRepository(repo),
                inject: [(0, typeorm_1.getRepositoryToken)(influencer_entity_1.InfluencerEntity)],
            },
            {
                provide: user_repository_1.UserRepository,
                useFactory: (repo) => new user_repository_1.UserRepository(repo),
                inject: [(0, typeorm_1.getRepositoryToken)(user_entity_1.UserEntity)],
            },
        ],
        exports: [azure_blob_services_1.AzureBlobService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map