import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { BaseServiceAbstract } from '@/modules/shared/services/base.abstract.service';
import { UsersRepository } from '@/repositories/user.repository';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
	constructor(
		private readonly userRepo: UsersRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		super(userRepo);
	}

	async findAll() {
		const cacheKey = 'users';
		const inCache = await this.cacheManager.get<any>(cacheKey);
		if (inCache) {
			return inCache;
		}
		const inDB = await this.userRepo.findAll({});
		await this.cacheManager.set(cacheKey, inDB, 1000000000000);
		return inDB;
	}

	async getOrCreateUser(address: string): Promise<User> {
		const user = await this.findOneByCondition({
			address: address.toLowerCase(),
		});
		if (user) {
			return user;
		}
		return await this.create({
			address: address.toLowerCase(),
			username: address,
			hideAddress: false,
			badges: [],
			currentRefreshTokens: [],
			followingCount: 0,
			followersCount: 0,
			point: 0,
		});
	}

	async setCurrentRefreshToken(id: string, hashedToken: string): Promise<void> {
		try {
			await this.userRepo.update(id, {
				currentRefreshTokens: [hashedToken],
			});
		} catch (error) {
			throw error;
		}
	}
}
