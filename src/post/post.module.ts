import { join } from 'path';
import { diskStorage } from 'multer';
import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// HELPERS
import { editFileName } from 'src/helpers/utils';
// MODULES
import { UsersModule } from 'src/users/users.module';
import { MailingModule } from 'src/mailing/mailing.module';
// CONTROLLERS
import { PostController } from './post.controller';
// PROVIDERS
import { postProviders } from './post.provider';
// SERVICES
import { PostService } from './post.service';

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
	controllers: [PostController],
	providers: [...postProviders, PostService]
})
export class PostModule {}
