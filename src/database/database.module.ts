import { Module } from '@nestjs/common';
// PROVIDERS
import { databaseProviders } from './database.providers';

@Module({
	providers: [...databaseProviders],
	exports: [...databaseProviders]
})
export class DatabaseModule {}
