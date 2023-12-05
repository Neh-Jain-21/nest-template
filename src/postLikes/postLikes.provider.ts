import { DataSource } from 'typeorm';
// ENTITIES
import { PostLikes } from './postLikes.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const postLikesProviders = [
	{
		provide: REPOSITORIES.POST_REPO,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(PostLikes),
		inject: [REPOSITORIES.DATA_SOURCE]
	}
];
