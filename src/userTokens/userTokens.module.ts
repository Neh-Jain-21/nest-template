import { Module, forwardRef } from '@nestjs/common';
// MODULES
import { UsersModule } from 'src/users/users.module';
// CONTROLLERS
import { UserTokensController } from './userTokens.controller';
// SERVICES
import { UserTokensService } from './userTokens.service';

@Module({
	imports: [forwardRef(() => UsersModule)],
	controllers: [UserTokensController],
	providers: [UserTokensService],
	exports: [UserTokensService]
})
export class UserTokensModule {}
