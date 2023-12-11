import { Inject, Injectable } from '@nestjs/common';
import {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
	UpdateResult
} from 'typeorm';
// ENTITIES
import { Posts } from './posts.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';
// TYPES
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PostsService {
	constructor(
		@Inject(REPOSITORIES.POST_REPO)
		private postsRepository: Repository<Posts>
	) {}

	async findOne(
		where: FindOptionsWhere<Posts> | FindOptionsWhere<Posts>[],
		options: FindOneOptions<Posts>
	): Promise<Posts> {
		return await this.postsRepository.findOne({ where, ...options });
	}

	async findAll(options: FindManyOptions<Posts>): Promise<Posts[]> {
		return await this.postsRepository.find(options);
	}

	async create(post: DeepPartial<Posts>): Promise<Posts> {
		return await this.postsRepository.save(post, { reload: true });
	}

	async updateById(
		id: Posts['id'],
		recordToUpdate: QueryDeepPartialEntity<Posts>
	): Promise<UpdateResult> {
		return await this.postsRepository.update({ id }, recordToUpdate);
	}
}
