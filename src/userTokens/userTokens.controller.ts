import { Controller, HttpStatus, Post, Body, HttpCode, Response } from '@nestjs/common';
// SERVICES
import { UsersService } from 'src/users/users.service';
import { UserTokensService } from './userTokens.service';
// TYPES
import { Response as ExpressResponse } from 'express';
import { UserTokensInterface } from './interfaces/userTokens.interface';

@Controller('user-tokens')
export class UserTokensController {
	constructor(
		private usersService: UsersService,
		private userTokensService: UserTokensService
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Body() body: Pick<UserTokensInterface, 'userId'>
	) {
		const user = this.usersService.findOneById(body.userId);

		if (!user) {
			res.status(HttpStatus.NOT_FOUND);

			return { message: 'User not found!' };
		}

		const userToken = this.userTokensService.create(body);

		return { message: 'Success', data: { ...userToken, user } };
	}
}
