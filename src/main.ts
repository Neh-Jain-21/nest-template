import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// MIDDLEWARES
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(new LoggerMiddleware().use);

	await app.listen(3000);
}

bootstrap();
