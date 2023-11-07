import { Module } from '@nestjs/common';
// MODULES
import { UserTokensModule } from 'src/userTokens/userTokens.module';
// CONTROLLERS
import { UsersController } from './users.controller';
// SERVICES
import { UsersService } from './users.service';

@Module({
	imports: [UserTokensModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}
