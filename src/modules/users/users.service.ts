import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from './interfaces/users.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
	constructor(
		@Inject('UsersRepositoryInterface')
		private readonly userRepo: UsersRepositoryInterface,
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
