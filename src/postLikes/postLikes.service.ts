import { Inject, Injectable } from '@nestjs/common';
import {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
	UpdateResult
} from 'typeorm';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';
// ENTITIES
import { PostLikes } from './postLikes.entity';
// TYPES
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PostLikesService {
	constructor(
		@Inject(REPOSITORIES.POST_LIKES_REPO)
		private postLikesRepository: Repository<PostLikes>
	) {}

	async findOne(
		where: FindOptionsWhere<PostLikes> | FindOptionsWhere<PostLikes>[],
		options?: FindOneOptions<PostLikes>
	): Promise<PostLikes> {
		return await this.postLikesRepository.findOne({ where, ...options });
	}

	async findAll(options: FindManyOptions<PostLikes>): Promise<PostLikes[]> {
		return await this.postLikesRepository.find(options);
	}

	async create(PostLikes: DeepPartial<PostLikes>): Promise<PostLikes> {
		return await this.postLikesRepository.save(PostLikes, { reload: true });
	}

	async updateById(
		id: PostLikes['id'],
		recordToUpdate: QueryDeepPartialEntity<PostLikes>
	): Promise<UpdateResult> {
		return await this.postLikesRepository.update({ id }, recordToUpdate);
	}

	async destroy(where: FindOptionsWhere<PostLikes>) {
		return await this.postLikesRepository.delete(where);
	}
}
