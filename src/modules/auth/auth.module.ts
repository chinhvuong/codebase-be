import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
	],
})
export class AuthModule {}
