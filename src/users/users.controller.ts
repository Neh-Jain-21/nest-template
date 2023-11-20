import { Controller } from '@nestjs/common';
// SERVICES
import { UsersService } from './users.service';
// TYPES

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}
}
