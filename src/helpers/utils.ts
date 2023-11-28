import { extname } from 'path';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

export const editFileName = (
	_: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void
) => {
	const name = file.originalname.split('.')[0];

	const fileExtName = extname(file.originalname);

	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');

	callback(null, `${name}-${randomName}${fileExtName}`);
};
