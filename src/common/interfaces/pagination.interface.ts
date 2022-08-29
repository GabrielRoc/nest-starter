export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}
