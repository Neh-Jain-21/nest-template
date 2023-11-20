import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// MODULES
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// MIDDLEWARES
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
// CONTROLLERS
import { UsersController } from './users/users.controller';

@Module({
	imports: [AuthModule, UsersModule]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes(UsersController);
	}
}
