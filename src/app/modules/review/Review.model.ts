import { model, Schema } from 'mongoose';
import { TReview } from './Review.interface';
import { ReviewMiddlewares } from './Review.middleware';

const reviewSchema = new Schema<TReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    bundle: {
      type: Schema.Types.ObjectId,
      ref: 'Bundle',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

reviewSchema.inject(ReviewMiddlewares.schema);

const Review = model<TReview>('Review', reviewSchema);

export default Review;
