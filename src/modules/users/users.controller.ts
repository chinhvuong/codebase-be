import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '@/types/request.type';

import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth()
	findAll() {
		return this.usersService.findAll();
	}

	@Get('me')
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth()
	getMe(@Req() request: RequestWithUser) {
		return {
			...request.user.toObject(),
			currentRefreshTokens: undefined,
		};
	}
}
