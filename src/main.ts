import { EXTRA_MODEL } from '@common/constants/extra-model.const';
import { AuthGuard } from '@guards/auth.guard';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as helmet from 'helmet';
import * as i18n from 'i18n';
import * as path from 'path';
import { TrimPipe } from 'src/pipes/trim.pipe';
import { AppModule } from './app.module';
import { APP_LOCALES, Locales } from './common/constants/global.const';
import LogService from './config/log.service';
import { AllExceptionsFilter } from './exceptions/all-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { setLocal } from './middlewares/locales.middleware';

const PORT = process.env.APP_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  i18n.configure({
    locales: APP_LOCALES,
    defaultLocale: Locales.VI,
    objectNotation: true,
    directory: path.join(__dirname, '/assets/lang'),
  });
  app.use(i18n.init);
  app.use(setLocal);
  app.use(json({ limit: process.env.LIMIT_REQUEST_BODY }));
  app.use(
    urlencoded({
      extended: true,
      limit: process.env.LIMIT_REQUEST_BODY,
    }),
  );
  app.useGlobalGuards(new AuthGuard(new Reflector()));
  app.enableCors();
  configSwagger(app);
  app.use(helmet());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new TrimPipe());

  await app.listen(PORT, () => {
    LogService.logInfo(`App is running with port ${PORT}`);
  });
}

function configSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MMQ Backend')
    .setDescription('MMQ Backend API')
    .addBearerAuth()
    .addSecurity('ApiKeyAuth', {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .addSecurityRequirements('ApiKeyAuth')
    .build();

  const options: SwaggerDocumentOptions = {
    extraModels: EXTRA_MODEL,
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
