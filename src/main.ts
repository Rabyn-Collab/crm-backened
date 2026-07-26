import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1); // 👈 fixed

  const config = new DocumentBuilder()
    .setTitle('Nest CRM API')
    .setDescription('API documentation for Nest CRM')
    .setVersion('1.0')
    .build();

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );


  app.enableCors({
    origin: ["https://crm-frontend-five-sigma.vercel.app", "https://crm-frontend-rt1t.onrender.com", "http://localhost:3000", "https://crm-frontend-production-c013.up.railway.app"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);



  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();