import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '@/types/request.type';

import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { FollowDto } from './dto/follow.dto';
import { FollowService } from './follow.service';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
	constructor(private readonly followService: FollowService) {}

	@Post()
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth()
	follow(@Body() data: FollowDto, @Req() request: RequestWithUser) {
		return this.followService.follow(request.user._id.toString(), data._id);
	}

	@Post('un-follow')
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth()
	unFollow(@Body() data: FollowDto, @Req() request: RequestWithUser) {
		return this.followService.unFollowUser(
			request.user._id.toString(),
			data._id,
		);
	}

	@Get('check-follow')
	@UseGuards(JwtAccessTokenGuard)
	@ApiBearerAuth()
	checkFollow(@Query() data: FollowDto, @Req() request: RequestWithUser) {
		return this.followService.checkIfFollowing(
			request.user._id.toString(),
			data._id,
		);
	}
}
