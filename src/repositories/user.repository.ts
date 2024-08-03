import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@/modules/users/entities/user.entity';
import { UsersRepositoryInterface } from '@/modules/users/interfaces/users.interface';

import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class UsersRepository
	extends BaseRepositoryAbstract<UserDocument>
	implements UsersRepositoryInterface
{
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
	) {
		super(userModel);
	}
}
