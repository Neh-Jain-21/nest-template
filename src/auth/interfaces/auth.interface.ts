import { Request as ExpressRequest } from 'express';

export interface IRegisterExpressRequest extends ExpressRequest {
	file: {
		originalname: string;
	};
}

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
