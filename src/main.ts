import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import chalk from 'chalk';

dotenv.config();

function checkEnvVars(requiredVars: string[]) {
  const missing = requiredVars.filter((v) => !process.env[v] || process.env[v].trim() === '');
  if (missing.length > 0) {
    console.error(chalk.red('❌ Faltan variables de entorno:'));
    missing.forEach((v) => console.error(`   - ${v}`));
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('❌ Unhandled Rejection:'), reason);
});
process.on('uncaughtException', (err) => {
  console.error(chalk.red('❌ Uncaught Exception:'), err);
});

async function bootstrap() {
  console.log(chalk.cyan('\n🧪 Iniciando Bootstrap...'));

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
  ]);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = parseInt(process.env.PORT || '3001', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(chalk.yellow(`🔧 Modo: ${nodeEnv}`));
  console.log(chalk.yellow(`🚪 Puerto configurado: ${port}`));

  app.use(helmet());
  app.use(cookieParser());

  // 🌍 Configuración CORS dinámica
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000'];

  console.log(chalk.blue(`🌐 CORS permitido para:`));
  allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(chalk.red(`🚫 CORS bloqueado para origen no permitido: ${origin}`));
        callback(new Error('CORS: Origin no permitido'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: '⚠️ Demasiadas solicitudes. Intenta nuevamente más tarde.',
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setGlobalPrefix('api/v1');


  // Base de datos
  console.log(chalk.blue('\n📡 Verificando conexión a base de datos...'));
  const dataSource = app.get(DataSource);
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    console.log(chalk.green('✅ Conexión a la base de datos establecida correctamente.'));
  } catch (error) {
    console.error(chalk.red('❌ Error al conectar a la base de datos:'), error.message);
    process.exit(1);
  }

  try {

    await app.listen(port);
    console.log(chalk.green(`🚀 Backend en línea en:`), chalk.underline(`http://localhost:${port}`));
  } catch (err) {
    console.error(chalk.red('❌ Error al iniciar el servidor:'), err.message);
    process.exit(1);
  }

  console.log(chalk.green('\n🎉 Aplicación iniciada correctamente.\n'));
}

bootstrap();
