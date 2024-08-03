import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '@/types/request.type';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { SignatureGuard } from './guards/signature.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(SignatureGuard)
	@Post('sign-in')
	// eslint-disable-next-line
	async signIn(@Req() request: RequestWithUser, @Body() signInData: SignInDto) {
		return await this.authService.signIn(request.user._id.toString());
	}

	@ApiBearerAuth()
	@UseGuards(JwtRefreshTokenGuard)
	@Post('refresh')
	async refreshAccessToken(@Req() request: RequestWithUser) {
		const { user } = request;
		// same like sign in
		return this.authService.signIn(user._id.toString());
	}
}
