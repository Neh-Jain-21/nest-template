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
import { Post } from './post.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';
// TYPES
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PostService {
	constructor(
		@Inject(REPOSITORIES.POST_REPO)
		private postRepository: Repository<Post>
	) {}

	async findOne(
		where: FindOptionsWhere<Post> | FindOptionsWhere<Post>[],
		options: FindOneOptions<Post>
	): Promise<Post> {
		return await this.postRepository.findOne({ where, ...options });
	}

	async findAll(options: FindManyOptions<Post>): Promise<Post[]> {
		return await this.postRepository.find(options);
	}

	async create(post: DeepPartial<Post>): Promise<Post> {
		return await this.postRepository.save(post, { reload: true });
	}

	async updateById(
		id: Post['id'],
		recordToUpdate: QueryDeepPartialEntity<Post>
	): Promise<UpdateResult> {
		return await this.postRepository.update({ id }, recordToUpdate);
	}
}
