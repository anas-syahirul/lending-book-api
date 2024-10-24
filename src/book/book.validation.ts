import { z, ZodType } from 'zod';

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(5).max(100),
    author: z.string().min(3).max(100),
    isbn: z.string().min(5).max(100),
    publishedAt: z.string().datetime(),
    copies: z.number(),
    status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED']),
  });
  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(5).max(100).optional(),
    author: z.string().min(3).max(100).optional(),
    isbn: z.string().min(5).max(100).optional(),
    publishedAt: z.string().datetime().optional(),
    copies: z.number().optional(),
    status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED']).optional(),
  });
  static readonly SEARCH: ZodType = z.object({
    title: z.string().min(1).max(100).optional(),
    author: z.string().min(3).max(100).optional(),
    isbn: z.string().min(5).max(100).optional(),
    status: z.enum(['AVAILABLE', 'BORROWED', 'RESERVED']).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
