import {
	Controller,
	HttpStatus,
	Post,
	Body,
	HttpCode,
	Response,
	UseInterceptors,
	UploadedFiles,
	Request,
	Param,
	Get
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
// SERVICES
import { PostsService } from './posts.service';
import { PostLikesService } from 'src/postLikes/postLikes.service';
// TYPES
import { Response as ExpressResponse } from 'express';
import { CreatePostDTO, LikePostDTO } from './dto/post.dto';
import { UserExpressRequest } from 'src/app';

@ApiTags('Posts')
@Controller('post')
export class PostsController {
	constructor(
		private postsService: PostsService,
		private postLikesService: PostLikesService
	) {}

	@Post()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Create Post' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				description: { type: 'string' },
				media: {
					type: 'array',
					items: { type: 'string', format: 'binary' }
				}
			}
		}
	})
	@ApiBearerAuth('access-token')
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FilesInterceptor('media'))
	async createPost(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse,
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: CreatePostDTO
	) {
		const medias = files.map((file) => ({
			media: file.filename,
			type: file.mimetype.includes('image') ? 'image' : 'video'
		}));

		const post = await this.postsService.create({
			user_id: req.user.id,
			description: body.description,
			postMedias: medias
		});

		if (!post) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return { message: 'Something Went Wrong!', data: {} };
		}

		// const postCreated = this.postMediaService.bulkCreate(medias);

		// if (!postCreated) return { message: 'Something Went Wrong!', data: {} };

		return { message: 'Success', data: post };
	}

	@Get()
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get Post' })
	@HttpCode(HttpStatus.OK)
	async getPost(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse
	) {
		const posts = await this.postsService.findAll({
			select: ['id', 'created_at', 'description'],
			relations: {
				user: true /* { first_name: true as never, last_name: true as never, image: true as never } */,
				postMedias: true /* { type: true as never, media: true as never } */
			}
		});

		if (!posts) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'Something went wrong!', data: {} };
		}

		posts.forEach((post) => {
			post.user.image = `http://${req.hostname}:3000/upload/${post.user.image}`;
			post.postMedias.forEach((media) => {
				media.media = `http://${req.hostname}:3000/upload/${media.media}`;
			});
		});

		return { message: 'Success!', data: posts };
	}

	@Get('likes')
	@ApiBearerAuth('access-token')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get Likes' })
	async getLikes(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse,
		@Param('id') id: number
	) {
		const postLikes = await this.postLikesService.findAll({
			select: ['id'],
			where: { post_id: id },
			relations: {
				user: { first_name: true as never, last_name: true as never, image: true as never }
			}
		});

		if (!postLikes) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'Something Went Wrong', data: {} };
		}

		postLikes.forEach((likes) => {
			likes.user.image = `http://${req.hostname}:${process.env.PORT}/users/${likes.user.image}`;
		});

		return { message: 'Success!', data: postLikes };
	}

	@Post('likes')
	@ApiBearerAuth('access-token')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Like Or Unlike Post' })
	async likePost(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: LikePostDTO
	) {
		const postAlreadyLiked = await this.postLikesService.findOne({
			post_id: body.id,
			user_id: req.user.id
		});

		if (!postAlreadyLiked) {
			const postLiked = await this.postLikesService.create({
				post_id: body.id,
				user_id: req.user.id
			});

			if (!postLiked) {
				res.status(HttpStatus.NOT_FOUND);
				return { message: 'Something Went Wrong', data: {} };
			}

			return { message: 'Post Liked!', data: {} };
		}

		const postUnLiked = await this.postLikesService.destroy({
			post_id: body.id,
			user_id: req.user.id
		});

		if (!postUnLiked) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'Something Went Wrong', data: {} };
		}

		return { message: 'Post Un Liked!', data: {} };
	}
}
