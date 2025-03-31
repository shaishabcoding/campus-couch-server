import { Types } from 'mongoose';
import { TReview } from './Review.interface';
import Review from './Review.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const ReviewServices = {
  async store(reviewData: TReview, user: Types.ObjectId, skip: boolean) {
    const { product, bundle } = reviewData;
    const filter: Partial<TReview> = {
      product,
      bundle,
      ...(!skip && { user }),
    };

    let review = await Review.findOne(filter);

    if (!review) review = new Review({ ...reviewData, user });
    else Object.assign(review, reviewData);

    return review.save();
  },

  async delete(reviewId: string, user: Types.ObjectId, skip: boolean) {
    const review = (await Review.findById(reviewId).lean())!;

    if (!skip && String(review.user) !== String(user))
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    return Review.findByIdAndDelete(reviewId);
  },

  async list(filter: Partial<TReview>, { page, limit }: Record<string, any>) {
    const reviews = await Review.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('rating user content updatedAt')
      .populate('user', 'name avatar -_id');

    const total = await Review.countDocuments(filter);

    return {
      reviews,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
    };
  },
};
