import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HeaderToContextInterceptor } from './auth/header-to-context.interceptor';
import { ClsService } from 'nestjs-cls';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(
        new HeaderToContextInterceptor(app.get(ClsService)),
    );
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Teya Take home API')
        .setDescription('Ledger API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
