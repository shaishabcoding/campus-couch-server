import { z } from 'zod';
import { json } from '../../../util/transform/json';
import { boolean } from '../../../util/transform/boolean';
import { array } from '../../../util/transform/array';

export const ProductValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      images: z.array(z.string()).min(1, 'At least one image is required'),
      description: z.string().min(1, 'Description is required'),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isRentable: z.string().transform(boolean).optional(),
      isBuyable: z.string().transform(boolean).optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      stock: z.coerce.number().min(1, 'Stock must be at least 1'),
      notes: z.string().transform(json).optional(),
      rating: z.coerce.number().min(1).max(5).optional(),
      color: z.string().optional(),
      size: z.string().optional(),
      materials: z.string().transform(json).optional(),
      height: z.string().optional(),
      width: z.string().optional(),
      length: z.string().optional(),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      images: z.array(z.string()).optional(),
      description: z.string().optional(),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isRentable: z.string().transform(boolean).optional(),
      isBuyable: z.string().transform(boolean).optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      stock: z.coerce.number().min(0).optional(),
      notes: z.string().transform(json).optional(),
      refProduct: z.string().optional(),
      color: z.string().optional(),
      size: z.string().optional(),
      materials: z.string().transform(json).optional(),
      height: z.string().optional(),
      width: z.string().optional(),
      length: z.string().optional(),
    }),
  }),

  list: z.object({
    query: z.object({
      sort: z.string().optional(),
      categories: z.string().transform(array).optional(),
      colors: z.string().transform(array).optional(),
      minPrice: z.coerce.number().optional(),
      maxPrice: z.coerce.number().optional(),
      sizes: z.string().transform(array).optional(),
      materials: z.string().transform(array).optional(),
      isBuyable: z.string().transform(boolean).optional(),
      isRentable: z.string().transform(boolean).optional(),
    }),
  }),
};
