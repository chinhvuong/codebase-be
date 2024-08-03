import {
	Document,
	FilterQuery,
	IfAny,
	QueryOptions,
	Require_id,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from 'mongoose';

import { FindAllResponse } from '@/types/common.type';

export interface BaseRepositoryInterface<T> {
	create(dto: T | any): Promise<T>;

	findOneById(id: string, projection?: string, option?: object): Promise<T>;

	findOneByCondition(
		condition?: object,
		projection?: string | string[] | object,
	): Promise<T>;

	findAll(
		condition: object,
		projection?: string | object,
		options?: object,
	): Promise<FindAllResponse<T>>;

	update(
		id: string,
		update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
	): Promise<T>;
	// softDelete(id: string): Promise<boolean>;

	delete(id: string): Promise<boolean>;

	findOneAndUpdate(
		filter?: FilterQuery<T>,
		update?: UpdateQuery<T>,
		options?: QueryOptions<T>,
	): Promise<IfAny<T, any, Document<unknown, object, T> & Require_id<T>>>;
}
