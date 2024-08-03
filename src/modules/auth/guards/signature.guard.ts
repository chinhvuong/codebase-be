import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UsersService } from '@/modules/users/users.service';

import { AuthService } from '../auth.service';

@Injectable()
export class SignatureGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const { address, signature } = request.body;

		const isValidSignature = this.authService.verifySignature(
			address,
			signature,
		);
		if (!isValidSignature) {
			throw new UnauthorizedException('Invalid signature');
		}

		const user = await this.usersService.getOrCreateUser(address);
		console.log(
			'🚀 ~ file: signature.guard.ts:34 ~ SignatureGuard ~ canActivate ~ user:',
			user,
		);

		request.user = user;
		return true;
	}
}
