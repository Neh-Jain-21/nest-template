import { Module } from '@nestjs/common';
// MODULES
import { DatabaseModule } from 'src/database/database.module';
// CONTROLLERS
import { UsersController } from './users.controller';
// SERVICES
import { UsersService } from './users.service';
// PROVIDERS
import { userProviders } from './user.providers';

@Module({
	imports: [DatabaseModule],
	controllers: [UsersController],
	providers: [...userProviders, UsersService],
	exports: [UsersService]
})
export class UsersModule {}
