import { z } from 'zod';

export const ReviewValidations = {
  store: z.object({
    body: z.object({
      rating: z.coerce.number().min(1).max(5).optional(),
      content: z.string().optional(),
    }),
  }),
};
