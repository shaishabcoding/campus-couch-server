import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { WishlistServices } from './Wishlist.service';

export const WishlistControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await WishlistServices.sync([params.productId], user!._id!);

    serveResponse(res, {
      message: 'Wishlist added successfully',
    });
  }),

  sync: catchAsync(async ({ body, user }, res) => {
    const wishlist =
      (await WishlistServices.sync(body.productIds, user!._id!))?.products ??
      [];

    serveResponse(res, {
      message: 'Wishlist sync successfully',
      data: wishlist,
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await WishlistServices.remove(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Wishlist removed successfully',
    });
  }),
};
