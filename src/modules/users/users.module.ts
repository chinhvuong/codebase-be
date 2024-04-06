import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '@/repositories/user.repository';

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
