import { z } from 'zod';
import config from '../../../config';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const PaymentValidations = {
  method: z.object({
    query: z.object({
      method: z
        .string()
        .default(config.payment.default_method)
        .superRefine(method => {
          const { methods } = config.payment;
          if (!methods.includes(method))
            throw new ServerError(
              StatusCodes.BAD_REQUEST,
              `Invalid payment method. Allowed: ${methods.join(', ')}`,
            );
        }),
    }),
  }),
};
