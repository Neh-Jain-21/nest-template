import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
// MODULES
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './post/posts.module';
import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
import { PostLikesModule } from './postLikes/postLikes.module';
import { PostMediaModule } from './postMedia/postMedia.module';
// MIDDLEWARES
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
// CONTROLLERS
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
// GUARDS
import { AuthGuard } from './common/guards/auth.guard';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		PostsModule,
		PostLikesModule,
		PostMediaModule,
		MailingModule,
		JwtModule.register({ global: true, secret: 'nest' }),
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
	controllers: [AppController],
	providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes(UsersController);
	}
}
