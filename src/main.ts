import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
<<<<<<< Updated upstream

async function bootstrap() {
  // Cargar variables de entorno
  dotenv.config();

  // Crear la aplicación
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Seguridad con cabeceras HTTP
=======
import chalk from 'chalk';
import { ValidationPipe } from '@nestjs/common';
import * as appInsights from 'applicationinsights';

dotenv.config();

function checkEnvVars(requiredVars: string[]) {
  const missing = requiredVars.filter((v) => !process.env[v] || process.env[v].trim() === '');
  if (missing.length > 0) {
    console.error(chalk.red('❌ Faltan variables de entorno:'));
    missing.forEach((v) => console.error(`   - ${v}`));
    process.exit(1);
  }
}

// 🚨 Captura de errores globales
process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('❌ Unhandled Rejection:'), reason);
  appInsights.defaultClient?.trackException({ exception: reason as Error });
});

process.on('uncaughtException', (err) => {
  console.error(chalk.red('❌ Uncaught Exception:'), err);
  appInsights.defaultClient?.trackException({ exception: err });
});

async function bootstrap() {
  console.log(chalk.cyan('\n🚀 Iniciando aplicación NestJS...'));

  // 🔒 Validación de variables de entorno requeridas
  checkEnvVars([
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'DATABASE_URL',
    'AZURE_STORAGE_ACCOUNT_NAME',
    'AZURE_STORAGE_KEY',
    'OPENAI_API_KEY',
    'JWT_SECRET',
    'CORS_ORIGINS',
    
  ]);

  // 📈 Inicializar Application Insights
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights
      .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setSendLiveMetrics(true)
      .start();

    console.log(chalk.green('✅ Application Insights habilitado'));
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🔐 Seguridad HTTP
>>>>>>> Stashed changes
  app.use(helmet());

  // Habilitar CORS de forma controlada (ajusta esto en producción)
  app.enableCors({
    origin: ['http://localhost:3000'], // Cambiar por dominio de frontend en producción
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.use(cookieParser());

<<<<<<< Updated upstream
  // Protección contra abuso con rate limiting
=======
  // 🌐 CORS dinámico
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];

  console.log(chalk.blue('\n🌐 Orígenes CORS permitidos:'));
  allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(chalk.red(`🚫 CORS bloqueado para: ${origin}`));
        callback(new Error('CORS: Origen no permitido'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 🛡️ Protección contra abuso (rate limiting)
>>>>>>> Stashed changes
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 peticiones por IP
      message: '⚠️ Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
    }),
  );

<<<<<<< Updated upstream
  // Servir archivos estáticos desde la carpeta public
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Verificar conexión a base de datos
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } else {
    console.error('❌ Fallo al conectar a la base de datos.');
  }

  // Levantar el servidor en el puerto especificado
  await app.listen(process.env.PORT || 3001);
  console.log(
    `🚀 Backend listo en http://localhost:${process.env.PORT || 3001}`,
  );
=======
  // 📂 Archivos estáticos (por si los usas)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // 📡 Verificación de conexión a base de datos
  const dataSource = app.get(DataSource);
  try {
    console.log(chalk.blue('\n📡 Verificando conexión a la base de datos...'));
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log(chalk.green('✅ Conexión a base de datos establecida correctamente.'));
  } catch (error: any) {
    console.error(chalk.red('❌ Error al conectar a base de datos:'), error.message);
    appInsights.defaultClient?.trackException({ exception: error });
    process.exit(1);
  }

  // 🚀 Lanzamiento del servidor
  const port = parseInt(process.env.PORT || '3001', 10);
  try {
    await app.listen(port);
    console.log(chalk.green(`\n🎉 Aplicación iniciada correctamente en puerto ${port}`));
  } catch (err: any) {
    console.error(chalk.red('❌ Error al iniciar el servidor:'), err.message);
    appInsights.defaultClient?.trackException({ exception: err });
    process.exit(1);
  }
>>>>>>> Stashed changes
}

bootstrap();
