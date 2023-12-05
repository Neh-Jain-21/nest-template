import { join } from 'path';
import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// MODULES
import { DatabaseModule } from 'src/database/database.module';
// CONTROLLERS
import { UsersController } from './users.controller';
// SERVICES
import { UsersService } from './users.service';
// PROVIDERS
import { userProviders } from './user.providers';
// HELPERS
import { editFileName } from 'src/helpers/utils';

@Module({
	imports: [
		DatabaseModule,
		MulterModule.register({
			storage: diskStorage({
				filename: editFileName,
				destination: join(__dirname, '/..', 'upload')
			})
		})
	],
	controllers: [UsersController],
	providers: [...userProviders, UsersService],
	exports: [UsersService]
})
export class UsersModule {}
