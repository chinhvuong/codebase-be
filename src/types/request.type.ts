import { Request } from 'express';

import { User } from '@/modules/users/entities/user.entity';

export interface RequestWithUser extends Request {
	user: User;
}
