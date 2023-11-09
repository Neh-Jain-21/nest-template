import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// MODULES
import { UsersModule } from './users/users.module';
import { UserTokensModule } from './userTokens/userTokens.module';
// MIDDLEWARES
import { AuthenticationMiddleware } from './common/middleware/authentication.middleware';
// CONTROLLERS
import { UsersController } from './users/users.controller';
import { UserTokensController } from './userTokens/userTokens.controller';

@Module({
	imports: [UsersModule, UserTokensModule]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthenticationMiddleware).forRoutes(UsersController);
		consumer.apply(AuthenticationMiddleware).forRoutes(UserTokensController);
	}
}
