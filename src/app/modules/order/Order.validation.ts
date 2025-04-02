import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Product } from '../product/Product.model';

const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(1, 'Zip is required'),
  street: z.string().min(1, 'Street is required'),
});

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact: z.string().min(1, 'Contact is required'),
  address: addressSchema,
});

export const OrderValidations = {
  checkout: z.object({
    body: z.object({
      details: z
        .array(
          z.object({
            product: z.string().refine(exists(Product)),
            quantity: z.number().default(1),
            rentalLength: z.number().optional(),
          }),
        )
        .min(1, 'At least one book is required'),
      customer: customerSchema,
    }),
  }),

  bundleCheckout: z.object({
    body: z.object({
      rentalLength: z.number().optional(),
      quantity: z.coerce.number().default(1),
      customer: customerSchema,
    }),
  }),
};
