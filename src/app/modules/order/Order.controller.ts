import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { PaymentServices } from '../payment/Payment.service';
import { OrderServices } from './Order.service';

export const OrderControllers = {
  checkout: catchAsync(async ({ body, user, query }, res) => {
    const { orderId, amount } = await OrderServices.checkout(body, user!._id!);

    const checkout_url = await PaymentServices.create({
      name: orderId.toString(),
      amount,
      method: query.method,
    });

    serveResponse(res, {
      message: 'Order created successfully!',
      meta: {
        orderId,
      },
      data: {
        checkout_url,
      },
    });
  }),
};
