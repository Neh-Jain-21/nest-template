export interface IRegisterRequest {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	password: string;
	dob: string;
	gender: string;
}

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IForgotPasswordRequest {
	email: string;
}
