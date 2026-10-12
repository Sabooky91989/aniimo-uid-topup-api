import { z } from 'zod';

export const createTopupOrderSchema = z.object({
  uid: z.string().min(5).max(20).regex(/^\d+$/),
  serverId: z.string().min(1),
  packageId: z.string().min(1),
  payChannel: z.enum(['mycard', 'mycard_points']).default('mycard_points'),
});

export type CreateTopupOrderInput = z.infer<typeof createTopupOrderSchema>;
