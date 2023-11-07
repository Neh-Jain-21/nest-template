import { Module } from '@nestjs/common';
// MODULES
import { UsersModule } from './users/users.module';
import { UserTokensModule } from './userTokens/userTokens.module';

@Module({
	imports: [UsersModule, UserTokensModule]
})
export class AppModule {}
