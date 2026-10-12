import { z } from 'zod';

export const verifyCharacterSchema = z.object({
  uid: z
    .string({ required_error: 'UID is required' })
    .trim()
    .min(5, 'UID must be at least 5 digits')
    .max(20, 'UID must not exceed 20 digits')
    .regex(/^\d+$/, 'UID must contain only numbers (เฉพาะตัวเลขเท่านั้น)'),
  server: z
    .string({ required_error: 'Server is required' })
    .trim()
    .min(1, 'Server identifier is required'),
});

export type VerifyCharacterInput = z.infer<typeof verifyCharacterSchema>;
