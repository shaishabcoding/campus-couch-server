import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Product } from '../product/Product.model';

export const CardValidations = {
  sync: z.object({
    body: z.object({
      productIds: z.array(z.string().refine(exists(Product))).default([]),
    }),
  }),
};
