import { ObjectId } from 'mongoose';

export class BaseEntity {
	_id?: ObjectId | string;
}
