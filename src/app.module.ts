import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
// MODULES
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
// MIDDLEWARES
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
// CONTROLLERS
import { UsersController } from './users/users.controller';

@Module({
	imports: [
		AuthModule,
		MailingModule,
		UsersModule,
		JwtModule.register({ global: true, secret: 'nest' }),
		MailerModule.forRoot({
			transport: {
				port: 587,
				secure: false,
				requireTLS: true,
				host: 'smtp.gmail.com',
				auth: { user: 'neh.jain@openxcellinc.com', pass: '123456!@#' }
			}
		})
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes(UsersController);
	}
}
