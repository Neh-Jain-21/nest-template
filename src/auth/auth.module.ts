import { join } from 'path';
import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// MODULES
import { UsersModule } from 'src/users/users.module';
import { MailingModule } from 'src/mailing/mailing.module';
// CONTROLLERS
import { AuthController } from './auth.controller';
// HELPERS
import { editFileName } from 'src/helpers/utils';

@Module({
	imports: [
		MailingModule,
		forwardRef(() => UsersModule),
		MulterModule.register({
			storage: diskStorage({
				filename: editFileName,
				destination: join(__dirname, '/..', 'upload')
			})
		})
	],
	controllers: [AuthController]
})
export class AuthModule {}
