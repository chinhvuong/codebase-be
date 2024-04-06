import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
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
