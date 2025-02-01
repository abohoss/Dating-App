export interface Pagination {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export class PaginationResult<T> {
    items?: T;
    pagination?: Pagination
}