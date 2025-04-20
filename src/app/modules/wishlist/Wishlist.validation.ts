import { z } from 'zod';

export const WishlistValidations = {
  sync: z.object({
    body: z.object({
      productIds: z.array(z.string()).default([]),
    }),
  }),
};
