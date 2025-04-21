import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { WishlistServices } from './Wishlist.service';

export const WishlistControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await WishlistServices.add(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Wishlist added successfully',
    });
  }),

  list: catchAsync(async ({ user }, res) => {
    const wishlist = await WishlistServices.list(user!._id!);

    serveResponse(res, {
      message: 'Wishlist retrieved successfully',
      data: wishlist?.products ?? [],
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await WishlistServices.remove(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Wishlist removed successfully',
    });
  }),

  exists: catchAsync(async ({ params, user }, res) => {
    const wishlist = !!(await WishlistServices.exists(
      params.productId,
      user!._id!,
    ));

    serveResponse(res, {
      message: `Wishlist ${wishlist ? 'exists' : 'does not exists'}.`,
      data: { wishlist },
    });
  }),
};
