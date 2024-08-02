import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '@/modules/users/users.service';

import { TokenPayload } from '../interfaces/token.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			// ignoreExpiration: true,
			secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
		});
	}

	async validate(payload: TokenPayload) {
		return await this.usersService.findOne(payload.userId);
	}
}
