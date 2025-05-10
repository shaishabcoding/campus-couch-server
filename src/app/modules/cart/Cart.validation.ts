import { z } from 'zod';

export const CardValidations = {
  add: z.object({
    body: z.object({
      quantity: z.coerce.number().min(1).default(1),
      rentalLength: z.coerce.number().optional(),
    }),
  }),
};
