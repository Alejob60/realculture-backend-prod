"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const helmet_1 = require("helmet");
const express_rate_limit_1 = require("express-rate-limit");
const dotenv = require("dotenv");
const path_1 = require("path");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.use(cookieParser());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: '⚠️ Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
    }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    }
    catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend escuchando en http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map