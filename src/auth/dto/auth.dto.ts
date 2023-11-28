import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	password: string;
	dob: string;
	gender: string;
}

export class LoginDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;
}

export class ForgotPasswordDTO {
	@ApiProperty()
	email: string;
}

export class VerifyOtpDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	otp: string;
}

export class ResetPasswordDTO {
	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;
}
