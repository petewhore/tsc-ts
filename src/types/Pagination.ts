import { z } from 'zod';

export const paginationSchema = z.object({
  pageNumber: z.coerce.number(),
  pageSize: z.coerce.number(),
  totalAvailable: z.coerce.number(),
});

export type PaginationType = z.infer<typeof paginationSchema>;

export class Pagination {
  pageNumber: number;
  pageSize: number;
  totalAvailable: number;

  constructor(data: PaginationType) {
    this.pageNumber = data.pageNumber;
    this.pageSize = data.pageSize;
    this.totalAvailable = data.totalAvailable;
  }

  get totalPages(): number {
    return Math.ceil(this.totalAvailable / this.pageSize);
  }

  get hasNextPage(): boolean {
    return this.pageNumber < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.pageNumber > 1;
  }
}