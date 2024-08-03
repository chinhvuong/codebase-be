import { FindAllResponse } from 'src/types/common.type';

import { BaseEntity } from '@/modules/shared/entities/base.entity';
import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';

import { BaseServiceInterface } from './base.interface.service';

export abstract class BaseServiceAbstract<T extends BaseEntity>
	implements BaseServiceInterface<T>
{
	constructor(private readonly repo: BaseRepositoryInterface<T>) {}

	async create(createDto: T | any): Promise<T> {
		return await this.repo.create(createDto);
	}

	async findAll(
		filter?: object,
		projection?: string | object,
		options?: object,
	): Promise<FindAllResponse<T>> {
		return await this.repo.findAll(filter, projection, options);
	}
	async findOne(id: string) {
		return await this.repo.findOneById(id);
	}

	async findOneByCondition(
		filter: Partial<T>,
		projection?: string | string[] | object,
	) {
		return await this.repo.findOneByCondition(filter, projection);
	}

	async update(id: string, updateDto: Partial<T>) {
		return await this.repo.update(id, updateDto);
	}

	async remove(id: string) {
		return await this.repo.delete(id);
	}
}
