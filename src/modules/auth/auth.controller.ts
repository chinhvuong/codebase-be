import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '@/types/request.type';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	async signUp(@Body() signUpDto: SignUpDto) {
		return await this.authService.signUp(signUpDto);
	}

	@UseGuards(LocalAuthGuard)
	@Post('sign-in')
	@ApiBody({
		type: SignInDto,
	})
	async signIn(@Req() request: RequestWithUser) {
		const { user } = request;
		return await this.authService.signIn(user._id.toString());
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
