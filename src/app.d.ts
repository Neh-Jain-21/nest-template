import { Request } from 'express';

export interface UserExpressRequest extends Request {
	user: { id: number };
}
