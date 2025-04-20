import { ClientSession, Model, startSession, Types } from 'mongoose';
import { TReview } from './Review.interface';
import Review from './Review.model';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import { Product } from '../product/Product.model';
import Bundle from '../bundle/Bundle.model';

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

    const session = await startSession();
    try {
      session.startTransaction();

      await review.save({ session });
      await this.updateOnRating({ bundle, product }, session);

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

    const { product, bundle } = review;

    if (!skip && !user.equals(review.user))
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    const session = await startSession();
    try {
      session.startTransaction();

      await review.deleteOne({ session });

      await this.updateOnRating({ product, bundle }, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async updateOnRating(
    { bundle, product }: Partial<TReview>,
    session: ClientSession,
  ) {
    const target = bundle ?? product;
    const key = bundle ? 'bundle' : 'product';
    const model: Model<any> = bundle ? Bundle : Product;

    const rating =
      (
        await Review.aggregate([
          { $match: { [key]: target } },
          { $group: { _id: null, avg: { $avg: '$rating' } } },
        ]).session(session)
      )[0]?.avg ?? 5;

    return model.findByIdAndUpdate(target, { rating }, { session });
  },

  async list(filter: Partial<TReview>, { page, limit }: Record<string, any>) {
    const reviews = await Review.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('rating user content updatedAt')
      .populate('user', 'name avatar');

    const total = await Review.countDocuments(filter);

    return {
      reviews,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  },
};
