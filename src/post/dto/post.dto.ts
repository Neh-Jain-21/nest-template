import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
	description: string;
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
