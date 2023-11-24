import { extname } from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
// MODULES
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
// MIDDLEWARES
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
// CONTROLLERS
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

export const editFileName = (
	_: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void
) => {
	const name = file.originalname.split('.')[0];

	const fileExtName = extname(file.originalname);

	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');

	callback(null, `${name}-${randomName}${fileExtName}`);
};

@Module({
	imports: [
		AuthModule,
		MailingModule,
		UsersModule,
		JwtModule.register({ global: true, secret: 'nest' }),
		MulterModule.register({
			storage: diskStorage({ destination: __dirname + '/upload', filename: editFileName })
		}),
		MailerModule.forRoot({
			transport: {
				port: 587,
				secure: false,
				requireTLS: true,
				host: 'smtp.gmail.com',
				auth: { user: 'neh.jain@openxcell.com', pass: '123456!@#' }
			}
		})
	],
	controllers: [AppController]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes(UsersController);
	}
}
