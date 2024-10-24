import { z, ZodType } from 'zod';

export class BorrowingValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.string().optional(),
    bookId: z.string(),
    borrowDate: z.string().datetime(),
    dueDate: z.string().datetime(),
  });
  static readonly UPDATE: ZodType = z.object({
    userId: z.string().optional(),
    bookId: z.string().optional(),
    borrowDate: z.string().datetime().optional(),
    dueDate: z.string().datetime().optional(),
    returnDate: z.string().datetime().optional(),
  });
  // static readonly SEARCH: ZodType = z.object({
  //   title: z.string().min(1).max(100).optional(),
  //   author: z.string().min(3).max(100).optional(),
  //   isbn: z.string().min(5).max(100).optional(),
  //   status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED']).optional(),
  //   page: z.number().min(1).positive(),
  //   size: z.number().min(1).max(100).positive(),
  // });
}
