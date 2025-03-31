import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await CartServices.sync([params.productId], user!._id!);

    serveResponse(res, {
      message: 'Cart added successfully',
    });
  }),

  sync: catchAsync(async ({ body, user }, res) => {
    const cart =
      (await CartServices.sync(body.productIds, user!._id!))?.products ?? [];

    serveResponse(res, {
      message: 'Cart sync successfully',
      data: cart,
    });
  }),

  retrieve: catchAsync(async ({ user }, res) => {
    const products = (await CartServices.retrieve(user!._id!))?.products ?? [];

    serveResponse(res, {
      message: 'Cart retrieved successfully',
      data: products,
    });
  }),

  remove: catchAsync(async ({ params, user }, res) => {
    await CartServices.remove(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Cart removed successfully',
    });
  }),
};
