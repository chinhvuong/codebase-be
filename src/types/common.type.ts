export enum SORT_TYPE {
	'DESC' = 'desc',
	'ASC' = 'acs',
}

export type FindAllResponse<T> = { count: number; items: T[] };

export type SortParams = { sortBy: string; sortType: SORT_TYPE };

export type SearchParams = { keyword: string; field: string };

export type PaginateParams = { offset: number; limit: number };
