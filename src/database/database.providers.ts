import { DataSource } from 'typeorm';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';

export const databaseProviders = [
	{
		provide: REPOSITORIES.DATA_SOURCE,
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'mysql',
				host: 'localhost',
				port: 3306,
				username: 'root',
				password: 'root',
				synchronize: true,
				database: 'openxcell',
				entities: [__dirname + '/../**/*.entity{.ts,.js}']
			});

			return dataSource.initialize();
		}
	}
];
