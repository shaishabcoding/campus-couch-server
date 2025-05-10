import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Product } from '../product/Product.model';
import { json } from '../../../util/transform/json';
import { boolean } from '../../../util/transform/boolean';

export const BundleValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      description: z.string().min(1, 'Description is required'),
      images: z.array(z.string()).min(1, 'At least one image is required'),
      products: z
        .string()
        .transform(json)
        .pipe(
          z
            .array(z.string().refine(exists(Product)))
            .min(1, 'At least one product is required'),
        ),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isBuyable: z.string().transform(boolean).optional(),
      isRentable: z.string().transform(boolean).optional(),
      notes: z.string().transform(json).optional(),
      rating: z.coerce.number().min(1).max(5).default(5),
      stock: z.coerce.number().min(1, 'Stock must be at least 1'),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      products: z
        .string()
        .transform(json)
        .pipe(z.array(z.string().refine(exists(Product))))
        .optional(),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isBuyable: z.string().transform(boolean).optional(),
      isRentable: z.string().transform(boolean).optional(),
      notes: z.string().transform(json).optional(),
      rating: z.coerce.number().min(1).max(5).optional(),
      stock: z.coerce.number().min(0).optional(),
    }),
  }),
};
