import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
  sync: catchAsync(async ({ body, user }, res) => {
    const cart =
      (await CartServices.sync(body?.details, user!._id!))?.details ?? [];

    serveResponse(res, {
      message: 'Cart sync successfully',
      data: cart,
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await CartServices.remove(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Cart removed successfully',
    });
  }),
};
