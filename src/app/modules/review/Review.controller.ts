import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { EUserRole } from '../user/User.enum';
import { ReviewServices } from './Review.service';

export const ReviewControllers = {
  store: catchAsync(async ({ body, user, params }, res) => {
    body.product = params?.productId;
    body.bundle = params?.bundleId;

    const data = await ReviewServices.store(
      body,
      user!._id!,
      user?.role === EUserRole.ADMIN,
    );

    serveResponse(res, {
      message: 'Review stored successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params, user }, res) => {
    await ReviewServices.delete(
      params.reviewId,
      user!._id!,
      user?.role === EUserRole.ADMIN,
    );

    serveResponse(res, {
      message: 'Review deleted successfully!',
    });
  }),
};
