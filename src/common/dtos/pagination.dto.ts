import { PaginationResult } from '../interfaces/pagination.interface';

export class MetaDto {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export class PaginationResponseDto<D, T = any> {
  data: T[] | D[];
  meta: MetaDto;

  constructor(
    paginationResult: PaginationResult<D>,
    DtoClass?: { new (data: D): T },
  ) {
    this.data = DtoClass
      ? paginationResult.data.map((item) => new DtoClass(item))
      : paginationResult.data;
    this.meta = paginationResult.meta;
  }
}
