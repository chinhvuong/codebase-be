import { Request } from 'express';

import { UserDocument } from '@/modules/users/entities/user.entity';

export interface RequestWithUser extends Request {
	user: UserDocument;
}
