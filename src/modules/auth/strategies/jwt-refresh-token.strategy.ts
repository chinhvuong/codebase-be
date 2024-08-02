import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { TokenPayload } from '../interfaces/token.interface';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt',
) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: TokenPayload) {
		return await this.authService.getUserIfRefreshTokenMatched(
			payload.userId,
			request.headers.authorization?.split('Bearer ')[1],
		);
	}
}
