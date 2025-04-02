import { z } from 'zod';

export const ProductValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      images: z.array(z.string()).min(1, 'At least one image is required'),
      description: z.string().min(1, 'Description is required'),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isRentable: z
        .string()
        .transform(v => v === 'true')
        .optional(),
      isBuyable: z
        .string()
        .transform(v => v === 'true')
        .optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      stock: z.coerce.number().min(1, 'Stock must be at least 1'),
      notes: z
        .string()
        .transform(strNotes => JSON.parse(strNotes) as string[])
        .optional(),
      rating: z.coerce.number().min(1).max(5).optional(),
      color: z.string().optional(),
      size: z.string().optional(),
      materials: z
        .string()
        .transform(strMaterials => JSON.parse(strMaterials) as string[])
        .optional(),
    }),
  }),

  edit: z.object({
    body: z.object({
      name: z.string().optional(),
      images: z.array(z.string()).optional(),
      description: z.string().optional(),
      price: z.coerce.number().optional(),
      rentPrice: z.coerce.number().optional(),
      isRentable: z
        .string()
        .transform(v => v === 'true')
        .optional(),
      isBuyable: z
        .string()
        .transform(v => v === 'true')
        .optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      stock: z.coerce.number().min(0).optional(),
      notes: z
        .string()
        .transform(strNotes => JSON.parse(strNotes) as string[])
        .optional(),
      refProduct: z.string().optional(),
      color: z.string().optional(),
      size: z.string().optional(),
      materials: z
        .string()
        .transform(strMaterials => JSON.parse(strMaterials) as string[])
        .optional(),
    }),
  }),
};
