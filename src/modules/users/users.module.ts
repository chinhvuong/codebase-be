import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersRepository } from '@/repositories/user.repository';

import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		{
			provide: 'UsersRepositoryInterface',
			useClass: UsersRepository,
		},
	],
	exports: [UsersService],
})
export class UsersModule {}
