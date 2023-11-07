import { Controller, Get, Query, HttpStatus, Response, Post, Body, HttpCode } from '@nestjs/common';
// SERVICES
import { UsersService } from './users.service';
import { UserTokensService } from 'src/userTokens/userTokens.service';
// TYPES
import { Response as ExpressResponse } from 'express';
import { UserInterface } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private userTokensService: UserTokensService
	) {}

	@Get()
	getAll(
		@Response({ passthrough: true }) res: ExpressResponse,
		@Query() query: { search: string }
	) {
		const user = this.usersService.findAll(query.search);

		if (!user) res.status(HttpStatus.NOT_FOUND);

		const userWithToken = user.map((user) => ({
			...user,
			tokens: this.userTokensService.findOneById(user.id)
		}));

		return { message: 'Success', data: userWithToken || [] };
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() body: Omit<UserInterface, 'id'>) {
		this.usersService.create(body);

		return { message: 'Success' };
	}
}
