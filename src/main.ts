import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

dotenv.config();

function checkEnvVars(requiredVars: string[]) {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error('❌ Faltan variables de entorno:', missing);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

async function bootstrap() {
  // Verifica las variables mínimas necesarias
  checkEnvVars([
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'DATABASE_URL', // opcional si usas url directamente
  ]);

  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: '⚠️ Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  const dataSource = app.get(DataSource);
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend escuchando en http://localhost:${port}`);
}

bootstrap();
