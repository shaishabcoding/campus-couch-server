import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { CartServices } from './Cart.service';

export const CartControllers = {
  add: catchAsync(async ({ params, user }, res) => {
    await CartServices.add(params.productId, user!._id!);

    serveResponse(res, {
      message: 'Cart added successfully',
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
