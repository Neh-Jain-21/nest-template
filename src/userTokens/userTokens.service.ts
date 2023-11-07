import { Injectable } from '@nestjs/common';
// TYPES
import { UserTokensInterface } from './interfaces/userTokens.interface';

@Injectable()
export class UserTokensService {
	private readonly userTokens: UserTokensInterface[] = [{ id: 1, userId: 1, token: 1 }];

	findOneById(id: number): UserTokensInterface[] {
		return this.userTokens.filter((user) => user.userId === id);
	}

	create(userToken: Pick<UserTokensInterface, 'userId'>): UserTokensInterface {
		const newUserToken: UserTokensInterface = {
			id: this.userTokens.length + 1,
			token: this.userTokens.length + 1,
			...userToken
		};

		this.userTokens.push(newUserToken);

		return newUserToken;
	}
}
