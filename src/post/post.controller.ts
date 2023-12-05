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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
// SERVICES
import { JwtService } from '@nestjs/jwt';
import { PostService } from './post.service';
import { MailingService } from 'src/mailing/mailing.service';
import { PostMediaService } from 'src/postMedia/postMedia.service';
import { PostLikesService } from 'src/postLikes/postLikes.service';
// HELPERS
// TYPES
import { Response as ExpressResponse } from 'express';
import {
	ForgotPasswordDTO,
	LoginDTO,
	CreatePostDTO,
	ResetPasswordDTO,
	VerifyOtpDTO
} from './dto/post.dto';
import { UserExpressRequest } from 'src/app';

@ApiTags('Post')
@Controller('post')
export class PostController {
	constructor(
		private postService: PostService,
		private postMediaService: PostMediaService,
		private postLikesService: PostLikesService,
		private mailingService: MailingService,
		private jwtService: JwtService
	) {}

	@Post()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Create Post' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				description: { type: 'string' },
				file: { type: 'string', format: 'binary' }
			}
		}
	})
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FilesInterceptor('media'))
	async createPost(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse,
		@UploadedFiles() files: Express.Multer.File[],
		@Body() body: CreatePostDTO
	) {
		const post = await this.postService.create({
			user_id: req.user.id,
			description: body.description
		});

		if (!post) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return { message: 'Something Went Wrong!', data: {} };
		}

		const medias = files.map((file) => ({
			post_id: post.id,
			media: file.filename,
			type: file.mimetype.includes('image') ? 'image' : 'video'
		}));

		const postCreated = this.postMediaService.bulkCreate(medias);

		if (!postCreated) return { message: 'Something Went Wrong!', data: {} };

		return { message: 'Success', data: postCreated };
	}

	@Get()
	@ApiOperation({ summary: 'Get Post' })
	@HttpCode(HttpStatus.OK)
	async getPost(
		@Request() req: UserExpressRequest,
		@Response({ passthrough: true }) res: ExpressResponse
	) {
		const posts = await this.postService.findAll({
			select: ['id', 'created_at', 'description'],
			relations: {
				user: { first_name: true as never, last_name: true as never, image: true as never },
				postMedias: { type: true as never, media: true as never }
			}
		});

		if (!posts) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found!', data: {} };
		}

		posts.forEach((post) => {
			post.user.image = `http://${req.hostname}:3000/upload/${post.User.image}`;
			post.postMedias.forEach((media) => {
				media.media = `http://${req.hostname}:3000/upload/${media.media}`;
			});
		});

		return { message: 'Success!', data: {} };
	}

	@Get('likes')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Forgot Password' })
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

	@Post('verify-otp')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Verify OTP' })
	async likePost(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: VerifyOtpDTO
	) {
		const otpVerified = await this.usersService.findOne(
			{ email: body.email, otp: body.otp },
			{ select: ['id', 'email'] }
		);

		if (!otpVerified) {
			res.status(HttpStatus.NOT_ACCEPTABLE);
			return { message: 'Incorrect OTP', data: {} };
		}

		await this.usersService.updateById(otpVerified.id, { otp: '' });

		return { message: 'OTP Verified', data: {} };
	}
}
