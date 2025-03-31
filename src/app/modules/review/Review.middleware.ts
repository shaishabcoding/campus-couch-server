import { Schema } from 'mongoose';
import { TReview } from './Review.interface';

export const ReviewMiddlewares = {
  schema: (schema: Schema<TReview>) => {
    schema.pre('save', function (next) {
      if (!this.rating) this.rating = 5;
      next();
    });
  },
};
