import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
// ENTITIES
import { PostMedia } from './postMedia.entity';
// HELPERS
import { REPOSITORIES } from 'src/helpers/constants';
// TYPES
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class PostMediaService {
	constructor(
		@Inject(REPOSITORIES.POST_MEDIA_REPO)
		private postMediaRepository: Repository<PostMedia>
	) {}

	async findOne(
		where: FindOptionsWhere<PostMedia> | FindOptionsWhere<PostMedia>[],
		options: FindOneOptions<PostMedia>
	): Promise<PostMedia> {
		return await this.postMediaRepository.findOne({ where, ...options });
	}

	async create(PostMedia: DeepPartial<PostMedia>): Promise<PostMedia> {
		return await this.postMediaRepository.save(PostMedia, { reload: true });
	}

	async bulkCreate(
		PostMedias: DeepPartial<PostMedia>[]
	): Promise<(DeepPartial<PostMedia> & PostMedia)[]> {
		return await this.postMediaRepository.save(PostMedias, { reload: true });
	}

	async updateById(
		id: PostMedia['id'],
		recordToUpdate: QueryDeepPartialEntity<PostMedia>
	): Promise<UpdateResult> {
		return await this.postMediaRepository.update({ id }, recordToUpdate);
	}
}
