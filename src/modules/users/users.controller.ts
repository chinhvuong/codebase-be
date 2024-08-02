import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
}
