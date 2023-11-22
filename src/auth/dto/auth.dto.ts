import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
	@ApiProperty()
	fname: string;

	@ApiProperty()
	lname: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	dob: string;

	@ApiProperty()
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
