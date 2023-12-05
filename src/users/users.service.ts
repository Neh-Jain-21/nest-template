import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
// ENTITIES
import { User } from './user.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';
// TYPES
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UsersService {
	constructor(
		@Inject(REPOSITORIES.USER_REPO)
		private userRepository: Repository<User>
	) {}

	async findOne(
		where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
		options: FindOneOptions<User>
	): Promise<User> {
		return await this.userRepository.findOne({ where, ...options });
	}

	async create(user: DeepPartial<User>): Promise<User> {
		return await this.userRepository.save(user, { reload: true });
	}

	async updateById(
		id: User['id'],
		recordToUpdate: QueryDeepPartialEntity<User>
	): Promise<UpdateResult> {
		return await this.userRepository.update({ id }, recordToUpdate);
	}

	async updateByEmail(
		email: User['email'],
		recordToUpdate: QueryDeepPartialEntity<User>
	): Promise<UpdateResult> {
		return await this.userRepository.update({ email }, recordToUpdate);
	}
}
