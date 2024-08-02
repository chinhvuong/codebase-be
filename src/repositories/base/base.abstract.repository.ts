import {
	FilterQuery,
	Model,
	ProjectionType,
	QueryOptions,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from 'mongoose';

import { BaseEntity } from '@/modules/shared/base/base.entity';
import { FindAllResponse } from '@/types/common.type';

import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
	implements BaseRepositoryInterface<T>
{
	protected constructor(private readonly model: Model<T>) {
		this.model = model;
	}

	async create(dto: T | any): Promise<T> {
		const createdData = await this.model.create(dto);
		return createdData.save() as Promise<T>;
	}

	async findOneById(
		id: string,
		projection?: string | string[],
		options?: QueryOptions<T>,
	): Promise<T> {
		const item = await this.model.findById(id, projection, options);
		return item;
	}

	async findOneByCondition(
		filter?: FilterQuery<T>,
		projection?: ProjectionType<T> | null,
		options?: QueryOptions<T> | null,
	): Promise<T> {
		return await this.model.findOne(filter, projection, options).exec();
	}

	async findAll(
		condition: FilterQuery<T>,
		projection?: string,
		options?: QueryOptions<T>,
	): Promise<FindAllResponse<T>> {
		const [count, items] = await Promise.all([
			this.model.countDocuments({ ...condition }),
			this.model.find({ ...condition }, projection, options),
		]);
		return {
			count,
			items,
		};
	}

	async update(
		id: string,
		update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
	): Promise<T> {
		await this.model
			.updateOne({ _id: id } as any, update, { new: true })
			.exec();
		return await this.model.findById(id).exec();
	}

	async delete(id: string): Promise<boolean> {
		const delete_item = await this.model.findById(id);
		if (!delete_item) {
			return false;
		}
		return !!(await this.model.findOneAndDelete({ _id: id } as any));
	}
}
