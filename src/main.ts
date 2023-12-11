import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
// MODULES
import { AppModule } from './app.module';
// MIDDLEWARES
import { LoggerMiddleware } from './common/middleware/logger.middleware';
// TYPES
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const config = new DocumentBuilder()
		.addServer('http://localhost:3000')
		.setTitle('Openxcell')
		.setDescription('Openxcell API description')
		.setVersion('1.0')
		.addBearerAuth(
			{
				description: `[just text field] Please enter token in following format: Bearer <JWT>`,
				name: 'Authorization',
				bearerFormat: 'Bearer',
				scheme: 'Bearer',
				type: 'http',
				in: 'Header'
			},
			'access-token'
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api', app, document);

	app.use(new LoggerMiddleware().use);

	app.use(function (request: Request, response: Response, next: NextFunction) {
		response.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});

	app.useStaticAssets(join(__dirname, '..', 'public'));

	await app.listen(3000);

	console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
