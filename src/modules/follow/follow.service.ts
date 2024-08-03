import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { BaseServiceAbstract } from '@/modules/shared/services/base.abstract.service';
import { FollowRepository } from '@/repositories/follow.repository';
import { UsersRepository } from '@/repositories/user.repository';

import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService extends BaseServiceAbstract<Follow> {
	constructor(
		private readonly followRepo: FollowRepository,
		private readonly userRepo: UsersRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(followRepo);
	}

	async follow(followerId: string, followingId: string) {
		if (followerId.toString() === followingId) {
			throw new BadRequestException('You can not follow yourself');
		}

		const existingFollow = await this.followRepo.findOneByCondition({
			followerId: followerId,
			followingId: followingId,
		});

		if (existingFollow) {
			throw new ConflictException('Already following this user.');
		}

		const followingUserExists = await this.userRepo.findOneById(followingId);

		if (!followingUserExists) {
			throw new NotFoundException('User to follow not found.');
		}

		const follow = await this.create({
			followerId,
			followingId,
		});

		// Update following and followers counts
		await Promise.all([
			this.userRepo.findOneAndUpdate(
				{ _id: followerId },
				{ $inc: { followingCount: 1 } },
			),
			this.userRepo.findOneAndUpdate(
				{ _id: followingId },
				{
					$inc: { followersCount: 1 },
				},
			),
		]);

		return follow;
	}

	async unFollowUser(followerId: string, followingId: string) {
		const existingFollow = await this.followRepo.findOneByCondition({
			followerId,
			followingId,
		});
		if (!existingFollow) {
			throw new NotFoundException('Not following this user.');
		}
		await this.followRepo.delete(existingFollow._id.toString());

		await Promise.all([
			this.userRepo.findOneAndUpdate(
				{ _id: followerId },
				{ $inc: { followingCount: -1 } },
			),
			this.userRepo.findOneAndUpdate(
				{ _id: followingId },
				{ $inc: { followersCount: -1 } },
			),
		]);

		return existingFollow;
	}

	async checkIfFollowing(followerId: string, followingId: string) {
		const follow = await this.followRepo.findOneByCondition({
			followerId,
			followingId,
		});

		return {
			following: !!follow,
		};
	}
}
