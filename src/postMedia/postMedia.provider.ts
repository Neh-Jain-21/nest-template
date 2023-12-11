import { DataSource } from 'typeorm';
// ENTITIES
import { PostMedia } from './postMedia.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const postMediaProviders = [
	{
		provide: REPOSITORIES.POST_MEDIA_REPO,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(PostMedia),
		inject: [REPOSITORIES.DATA_SOURCE]
	}
];
