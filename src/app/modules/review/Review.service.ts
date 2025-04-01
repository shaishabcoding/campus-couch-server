import { ClientSession, startSession, Types } from 'mongoose';
import { TReview } from './Review.interface';
import Review from './Review.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/Product.model';

export const ReviewServices = {
  async store(
    reviewData: Record<string, any>,
    user: Types.ObjectId,
    skip: boolean,
  ) {
    const { product, bundle } = reviewData;
    const filter: Partial<TReview> = {
      product,
      bundle,
      ...(!skip && { user }),
    };

    let review = await Review.findOne(filter);

    if (!review) review = new Review({ ...reviewData, user });
    else Object.assign(review, reviewData);

    const session = await startSession();
    try {
      session.startTransaction();

      await review.save({ session });
      if (product) await this.updateOnRating(product.oid, 'product', session);
      /** TODO: update bundle rating */

      await session.commitTransaction();
      return review;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async delete(reviewId: string, user: Types.ObjectId, skip: boolean) {
    const review = (await Review.findById(reviewId))!;

    if (!skip && !user.equals(review.user))
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    const session = await startSession();
    try {
      session.startTransaction();

      await review.deleteOne({ session });

      if (review.product)
        await this.updateOnRating(review.product, 'product', session);

      /** TODO: update bundle rating */

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async updateOnRating(
    _id: Types.ObjectId,
    type: 'product' | 'bundle',
    session: ClientSession,
  ) {
    const rating =
      (
        await Review.aggregate([
          { $match: { [type]: _id } },
          { $group: { _id: null, avg: { $avg: '$rating' } } },
        ]).session(session)
      )[0]?.avg ?? 5;

    switch (type) {
      case 'product':
        return Product.findByIdAndUpdate(_id, { rating }, { session });
    }
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
