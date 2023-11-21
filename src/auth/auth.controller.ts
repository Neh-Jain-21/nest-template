import {
	Controller,
	HttpStatus,
	Post,
	Body,
	HttpCode,
	Response,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
// SERVICES
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
// TYPES
import { Response as ExpressResponse } from 'express';
import {
	IForgotPasswordRequest,
	ILoginRequest,
	IRegisterRequest
} from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	async register(
		@Response({ passthrough: true }) res: ExpressResponse,
		@UploadedFile() file: Express.Multer.File,
		@Body() body: IRegisterRequest
	) {
		let encPassword: string;

		if (body.password) encPassword = await bcrypt.hash(body.password, 8);

		// create user
		const register = await this.usersService.create({
			first_name: body.fname,
			last_name: body.lname,
			email: body.email,
			phone: body.phone,
			password: encPassword,
			dob: body.dob,
			gender: body.gender,
			image: file.originalname
		});

		if (!register) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return { message: 'Something Went Wrong!', data: {} };
		}

		return { message: 'Success', data: { id: register.id, email: register.email } };
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: ILoginRequest
	) {
		const user = await this.usersService.findOne(
			{ email: body.email },
			{ select: ['id', 'email', 'password'] }
		);

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found!', data: {} };
		}

		const passwordMatch = await bcrypt.compare(body.password, user.password);

		if (!passwordMatch) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'Password Incorrect', data: {} };
		}

		const token = this.jwtService.sign({ id: user.id });

		await this.usersService.update(user.id, { token });

		return { message: 'Success!', data: { token } };
	}

	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	async forgotPassword(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: IForgotPasswordRequest
	) {
		const user = await this.usersService.findOne(
			{ email: body.email },
			{ select: ['id', 'email'] }
		);

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);
			return { message: 'User not found!', data: {} };
		}

		const random = Math.floor(Math.random() * 10000);

		return { message: 'Success!', data: {} };
	}
}
