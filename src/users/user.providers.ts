import { DataSource } from 'typeorm';
// ENTITIES
import { User } from './user.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const userProviders = [
	{
		provide: REPOSITORIES.USER_REPO,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
		inject: [REPOSITORIES.DATA_SOURCE]
	}
];
