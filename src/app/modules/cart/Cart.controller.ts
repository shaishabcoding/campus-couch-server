import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
  list: catchAsync(async ({ user }, res) => {
    const cart = await CartServices.list(user!._id!);

    serveResponse(res, {
      message: 'Cart retrieved successfully',
      data: cart?.details ?? [],
    });
  }),

  add: catchAsync(async ({ body, params, user }, res) => {
    body.product = params.productId;

    await CartServices.add(body, user!._id!);

    serveResponse(res, {
      message: 'Cart added successfully',
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await CartServices.remove(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Cart removed successfully',
    });
  }),
};
