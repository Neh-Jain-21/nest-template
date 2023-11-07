import { Injectable } from '@nestjs/common';
// TYPES
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
	private readonly users: UserInterface[] = [{ id: 1, name: 'Neh' }];

	findAll(name: string): UserInterface[] {
		return name ? this.users.filter((user) => name.includes(JSON.stringify(user))) : this.users;
	}

	findOneById(id: number): UserInterface {
		return this.users.find((user) => user.id === id);
	}

	create(user: Omit<UserInterface, 'id'>) {
		this.users.push({ id: this.users.length + 1, ...user });
	}
}
