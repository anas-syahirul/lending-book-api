import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    email: z.string().email().min(5).max(50),
    password: z.string().min(5).max(12),
    role: z.enum(['MEMBER', 'STAFF']),
  });
  static readonly LOGIN: ZodType = z.object({
    email: z.string().email().min(5).max(50),
    password: z.string().min(5).max(12),
  });
}
