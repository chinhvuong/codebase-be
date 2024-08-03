import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Follow, FollowSchema } from '@/modules/follow/entities/follow.entity';
import { User, UserSchema } from '@/modules/users/entities/user.entity';
import { UsersRepository } from '@/repositories/user.repository';

import { FollowRepository } from './follow.repository';

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Follow.name, schema: FollowSchema },
			{ name: User.name, schema: UserSchema },
		]),
	],
	providers: [FollowRepository, UsersRepository],
	exports: [FollowRepository, UsersRepository],
})
export class RepositoryModule {}
