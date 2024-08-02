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

	// async findAllWithSubFields(
	//     condition: FilterQuery<UserDocument>,
	//     projection?: string,
	//     populate?: string[] | PopulateOptions | PopulateOptions[],
	// ): Promise<FindAllResponse<UserDocument>> {
	//     const [count, items] = await Promise.all([
	//         this.userModel.countDocuments({ ...condition }),
	//         this.userModel
	//             .find({ ...condition, deleted_at: null }, projection)
	//             .populate(populate),
	//     ]);
	//     return {
	//         count,
	//         items,
	//     };
	// }
}
