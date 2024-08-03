import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
	Follow,
	FollowDocument,
} from '@/modules/follow/entities/follow.entity';
import { FollowRepositoryInterface } from '@/modules/follow/interfaces/follow.interface';

import { BaseRepositoryAbstract } from './base/base.abstract.repository';

@Injectable()
export class FollowRepository
	extends BaseRepositoryAbstract<FollowDocument>
	implements FollowRepositoryInterface
{
	constructor(
		@InjectModel(Follow.name)
		private readonly followModel: Model<FollowDocument>,
	) {
		super(followModel);
	}
}
