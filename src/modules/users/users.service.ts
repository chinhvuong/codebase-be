import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from './interfaces/users.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
	constructor(
		@Inject('UsersRepositoryInterface')
		private readonly userRepo: UsersRepositoryInterface,
	) {
		super(userRepo);
	}

	findAll() {
		return this.userRepo.findAll({});
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
