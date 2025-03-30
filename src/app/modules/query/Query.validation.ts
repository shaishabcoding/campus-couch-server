import { z } from 'zod';
import { exists } from '../../../util/db/exists';
import { Model } from 'mongoose';

export const QueryValidations = {
  list: z.object({
    query: z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
    }),
  }),

  /**
   * Validation for checking if a document exists in the given model.
   * @param _id The name of the param containing the document ID
   * @param model The mongoose model for the document
   */
  exists: (_id: string, model: Model<any>) =>
    z.object({
      params: z.object({
        [_id]: z.string().refine(exists(model)),
      }),
    }),
};
