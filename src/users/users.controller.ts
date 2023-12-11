import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import * as bcrypt from 'bcrypt';
// SERVICES
import { UsersService } from './users.service';
// ENTITIES
import { User } from './user.entity';
// TYPES
import { UserExpressRequest } from 'src/app';
import { Response as ExpressResponse } from 'express';
import { ChangePasswordDTO, UpdateUserDetailsDTO } from './dto/user.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@ApiTags('User')
@Controller('user')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('username')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth('access-token')
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
	@ApiBearerAuth('access-token')
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
	@ApiBearerAuth('access-token')
	async updateUserDetails(
		@Request() req: UserExpressRequest,
		@Response() res: ExpressResponse,
		@UploadedFile('file') file: Express.Multer.File,
		@Body() body: UpdateUserDetailsDTO
	) {
		const updateObj: QueryDeepPartialEntity<User> = {
			first_name: body.fname,
			last_name: body.lname,
			phone: body.phone,
			gender: body.gender,
			dob: body.dob
		};

		if (file) updateObj.image = file.filename;

		const updated = await this.usersService.updateById(req.user.id, updateObj);

		if (!updated) {
			res.status(HttpStatus.NOT_MODIFIED);
			return { message: 'Something went wrong!', data: {} };
		}

		return { message: 'User Updated' };
	}

	@Post('change-password')
	@ApiBearerAuth('access-token')
	async changePassword(
		@Request() req: UserExpressRequest,
		@Response() res: ExpressResponse,
		@Body() body: ChangePasswordDTO
	) {
		let encPassword: string;
		const user = await this.usersService.findOne({ id: req.user.id }, { select: ['password'] });

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found!', data: {} };
		}

		if (!(await bcrypt.compare(body.oldPassword, user.password))) {
			res.status(HttpStatus.CONFLICT);
			return { message: 'Incorrect Old Password!', data: {} };
		}

		if (body.newPassword) encPassword = await bcrypt.hash(body.newPassword, 8);

		const updated = await this.usersService.updateById(req.user.id, { password: encPassword });

		if (!updated) {
			res.status(HttpStatus.CONFLICT);
			return { message: 'Something went wrong, Try Again!', data: {} };
		}

		return { message: 'Password Updated', data: {} };
	}
}
