import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Product } from '../product/Product.model';

export const CardValidations = {
  sync: z.object({
    body: z.object({
      details: z.array(
        z.object({
          product: z.string().refine(exists(Product)),
          quantity: z.number().default(1),
          rentalLength: z.number().optional(),
        }),
      ),
    }),
  }),
};
