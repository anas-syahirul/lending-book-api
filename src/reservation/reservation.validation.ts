import { z, ZodType } from 'zod';

export class ReservationValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.string().optional(),
    bookId: z.string(),
    reservationDate: z.string().datetime(),
    status: z.enum(['ACTIVE', 'CANCELLED', 'FULFILLED']),
  });
  static readonly UPDATE: ZodType = z.object({
    userId: z.string().optional(),
    bookId: z.string().optional(),
    reservationDate: z.string().datetime().optional(),
    status: z.enum(['ACTIVE', 'CANCELLED', 'FULFILLED']).optional(),
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
