import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// MIDDLEWARES
import { LoggerMiddleware } from './common/middleware/logger.middleware';
// TYPES
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Openxcell')
		.setDescription('Openxcell API description')
		.setVersion('1.0')
		.addTag('Auth')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api', app, document);

	app.use(new LoggerMiddleware().use);

	console.log(join(__dirname, '..', 'public'));

	app.useStaticAssets(join(__dirname, '..', 'public'));

	await app.listen(3000);

	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
