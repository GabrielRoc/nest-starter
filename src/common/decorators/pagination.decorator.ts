import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { PaginationParams } from '../interfaces/pagination.interface';

export function Pagination() {
  return createParamDecorator(
    async (_data: unknown, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const paginationParams: PaginationParams = {
        page: 1,
        limit: 10,
      };

      if (request.query.page) {
        if (request.query.page < 1)
          throw new BadRequestException('Page must be greater than 1');
        paginationParams.page = request.query.page;
      }

      if (request.query.limit) {
        if (request.query.limit < 1)
          throw new BadRequestException('Limit must be greater than 1');
        paginationParams.limit = request.query.limit;
      }

      return paginationParams;
    },
  )();
}
