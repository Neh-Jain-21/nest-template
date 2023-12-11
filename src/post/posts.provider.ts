import { DataSource } from 'typeorm';
// ENTITIES
import { Posts } from './posts.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const postsProviders = [
	{
		provide: REPOSITORIES.POST_REPO,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(Posts),
		inject: [REPOSITORIES.DATA_SOURCE]
	}
];
