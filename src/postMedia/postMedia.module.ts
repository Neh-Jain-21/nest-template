import { join } from 'path';
import { diskStorage } from 'multer';
import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// HELPERS
import { editFileName } from 'src/helpers/utils';
// MODULES
import { UsersModule } from 'src/users/users.module';
import { MailingModule } from 'src/mailing/mailing.module';
// PROVIDERS
import { postMediaProviders } from './postMedia.provider';
// SERVICES
import { PostMediaService } from './postMedia.service';

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
	providers: [...postMediaProviders, PostMediaService]
})
export class PostMediaModule {}
