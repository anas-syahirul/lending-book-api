import { BookStatus } from '@prisma/client';

export class BookResponse {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedAt: Date;
  copies: number;
  status: BookStatus;
}

export class CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publishedAt: Date;
  copies: number;
  status: BookStatus;
}

export class UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publishedAt?: Date;
  copies?: number;
  status?: BookStatus;
}

export class SearchBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  status?: BookStatus;
  page: number;
  size: number;
}
