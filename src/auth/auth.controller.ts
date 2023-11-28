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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
// SERVICES
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailingService } from 'src/mailing/mailing.service';
// HELPERS
import { SkipAuth } from 'src/helpers/utils';
// TYPES
import { Response as ExpressResponse } from 'express';
import {
	ForgotPasswordDTO,
	LoginDTO,
	RegisterDTO,
	ResetPasswordDTO,
	VerifyOtpDTO
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private usersService: UsersService,
		private mailingService: MailingService,
		private jwtService: JwtService
	) {}

	@SkipAuth()
	@Post('register')
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Register User' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				fname: { type: 'string' },
				lname: { type: 'string' },
				email: { type: 'string' },
				phone: { type: 'string' },
				password: { type: 'string' },
				dob: { type: 'string' },
				gender: { type: 'string' },
				file: { type: 'string', format: 'binary' }
			}
		}
	})
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	async register(
		@Response({ passthrough: true }) res: ExpressResponse,
		@UploadedFile('file') file: Express.Multer.File,
		@Body() body: RegisterDTO
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
			image: file.filename
		});

		if (!register) {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return { message: 'Something Went Wrong!', data: {} };
		}

		return { message: 'Success', data: { id: register.id, email: register.email } };
	}

	@SkipAuth()
	@Post('login')
	@ApiOperation({ summary: 'Login User' })
	@HttpCode(HttpStatus.OK)
	async login(@Response({ passthrough: true }) res: ExpressResponse, @Body() body: LoginDTO) {
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

		await this.usersService.updateById(user.id, { token });

		return { message: 'Success!', data: { token } };
	}

	@SkipAuth()
	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Forgot Password' })
	async forgotPassword(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: ForgotPasswordDTO
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

		await this.mailingService.sendMail(
			body.email,
			'Forgot Password OTP',
			`Your OTP is ${random}`
		);

		await this.usersService.updateById(user.id, { otp: random.toString() });

		return { message: 'Success!', data: {} };
	}

	@SkipAuth()
	@Post('verify-otp')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Verify OTP' })
	async verifyOtp(
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

	@SkipAuth()
	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Reset Password' })
	async resetPassword(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: ResetPasswordDTO
	) {
		let encPassword: string;

		if (body.password) encPassword = await bcrypt.hash(body.password, 8);

		await this.usersService.updateByEmail(body.email, { password: encPassword });

		return { message: 'Success!', data: {} };
	}
}
