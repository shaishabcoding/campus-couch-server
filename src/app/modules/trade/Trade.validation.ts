import { z } from 'zod';
import { customerSchema } from '../order/Order.validation';

export const TradeValidations = {
  create: z.object({
    body: z.object({
      name: z.string().min(1, 'Product name is required'),
      description: z.string().min(1, 'Description is required'),
      images: z.array(z.string()).min(1, 'At least one image is required'),
      category: z.string().min(1, 'Category is required'),
      condition: z.string().min(1, 'Condition is required'),
      price: z.coerce.number().min(1, 'Price must be at least 1'),
      customer: customerSchema,
    }),
  }),
};
