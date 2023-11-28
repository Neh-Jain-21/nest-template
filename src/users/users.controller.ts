import { ApiTags } from '@nestjs/swagger';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	Response,
	UploadedFile
} from '@nestjs/common';
// SERVICES
import { UsersService } from './users.service';
// TYPES
import { UserExpressRequest } from 'src/app';
import { Response as ExpressResponse } from 'express';
import { UpdateUserDetailsDTO } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('username')
	@HttpCode(HttpStatus.OK)
	async getUserName(@Request() req: UserExpressRequest, @Response() res: ExpressResponse) {
		const user = await this.usersService.findOne(
			{ id: req.user.id },
			{ select: ['first_name', 'last_name'] }
		);

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found', data: {} };
		}

		return { message: 'Success!', data: user };
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getUserDetails(@Request() req: UserExpressRequest, @Response() res: ExpressResponse) {
		const user = await this.usersService.findOne(
			{ id: req.user.id },
			{ select: ['first_name', 'last_name', 'email', 'phone', 'dob', 'gender', 'image'] }
		);

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found', data: {} };
		}

		return {
			message: 'Success!',
			data: { ...user, image: `http://${req.hostname}:3000/${user.image}` }
		};
	}

	@Post()
	async updateUserDetails(
		@Request() req: UserExpressRequest,
		@UploadedFile('file') file: Express.Multer.File,
		@Body() body: UpdateUserDetailsDTO
	) {
		const updated = this.usersService.updateById(req.user.id, { first_name: body.fname });
	}

	@Post('change-password')
	async changePassword() {}
}
