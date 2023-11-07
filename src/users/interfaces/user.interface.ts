import { UserTokensInterface } from 'src/userTokens/interfaces/userTokens.interface';

export interface UserInterface {
	id: number;
	name: string;
	tokens?: UserTokensInterface[];
}
