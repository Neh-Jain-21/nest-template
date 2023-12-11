import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// SERVICES
import { UsersService } from 'src/users/users.service';
// HELPERS
import { IS_PUBLIC_KEY } from 'src/helpers/utils';
// TYPES
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private usersService: UsersService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException();

		const decodedData = this.jwtService.decode<{ id: number }>(token);

		if (!decodedData.id) throw new UnauthorizedException();

		const user = await this.usersService.findOne({ id: decodedData.id }, { select: ['token'] });

		if (user.token !== token) throw new UnauthorizedException();

		request['user'] = decodedData;

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];

		return type === 'Bearer' ? token : undefined;
	}
}
