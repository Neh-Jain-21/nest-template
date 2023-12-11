import { join } from 'path';
import { diskStorage } from 'multer';
import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// HELPERS
import { editFileName } from 'src/helpers/utils';
// MODULES
import { DatabaseModule } from 'src/database/database.module';
import { PostLikesModule } from 'src/postLikes/postLikes.module';
import { PostMediaModule } from 'src/postMedia/postMedia.module';
// CONTROLLERS
import { PostsController } from './posts.controller';
// PROVIDERS
import { postsProviders } from './posts.provider';
// SERVICES
import { PostsService } from './posts.service';

@Module({
	imports: [
		DatabaseModule,
		forwardRef(() => PostLikesModule),
		forwardRef(() => PostMediaModule),
		MulterModule.register({
			storage: diskStorage({
				filename: editFileName,
				destination: join(__dirname, '/..', 'upload')
			})
		})
	],
	controllers: [PostsController],
	providers: [...postsProviders, PostsService]
})
export class PostsModule {}
