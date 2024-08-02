import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' }); // Mặc định là username, đổi sang email
	}

	async validate(email: string, password: string) {
		const user = await this.authService.getAuthenticatedUser(email, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
