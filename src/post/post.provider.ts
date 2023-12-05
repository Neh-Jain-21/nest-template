import { DataSource } from 'typeorm';
// ENTITIES
import { Post } from './post.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const postProviders = [
	{
		provide: REPOSITORIES.POST_REPO,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
		inject: [REPOSITORIES.DATA_SOURCE]
	}
];
