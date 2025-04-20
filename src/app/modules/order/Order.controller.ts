import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { PaymentServices } from '../payment/Payment.service';
import { EUserRole } from '../user/User.enum';
import { EOrderState } from './Order.enum';
import { OrderServices } from './Order.service';

export const OrderControllers = {
  checkout: catchAsync(
    async ({ body, user, query, params: { bundleId } }, res) => {
      const { order, amount } = !bundleId
        ? await OrderServices.checkout(body, user!._id!)
        : await OrderServices.bundleCheckout({ ...body, bundleId }, user!._id!);

      const checkout_url = await PaymentServices.create({
        name: order._id.toString(),
        amount,
        method: query.method,
      });

      serveResponse(res, {
        message: 'Order created successfully!',
        meta: {
          order,
          method: query.method,
        },
        data: {
          checkout_url,
        },
      });
    },
  ),

  changeState: catchAsync(async ({ params, user }, res) => {
    if (user?.role !== EUserRole.ADMIN) params.state = EOrderState.CANCEL;

    const data = await OrderServices.changeState(
      params.orderId,
      params.state as EOrderState,
    );

    serveResponse(res, {
      message: `Order ${params.state} successfully!`,
      data,
    });
  }),

  list: catchAsync(async ({ query, user }, res) => {
    const { meta, orders } = await OrderServices.list(query, user!);

    serveResponse(res, {
      message: 'Orders retrieved successfully!',
      meta,
      data: orders,
    });
  }),

  retrieve: catchAsync(async ({ user, params }, res) => {
    const data = await OrderServices.retrieve(params.orderId, user!);

    serveResponse(res, {
      message: 'Order retrieved successfully!',
      data,
    });
  }),
};
