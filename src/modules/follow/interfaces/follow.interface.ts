import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';

import { Follow } from '../entities/follow.entity';

export interface FollowRepositoryInterface
	extends BaseRepositoryInterface<Follow> {}
