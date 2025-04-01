import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Product } from '../product/Product.model';

export const BundleValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().min(1, 'Description is required'),
      images: z.array(z.string()).min(1, 'At least one image is required'),
      products: z
        .array(z.string().refine(exists(Product)))
        .min(1, 'At least one product is required'),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isBuyable: z.boolean(),
      isRentable: z.boolean(),
      notes: z.array(z.string().trim()).default([]),
      rating: z.coerce.number().min(1).max(5).default(5),
    }),
  }),
};
