import { Types } from 'mongoose';
import { TOrder } from './Order.interface';
import { Product } from '../product/Product.model';
import Order from './Order.model';
import { EOrderState } from './Order.enum';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const OrderServices = {
  async checkout({ details, customer }: TOrder, user: Types.ObjectId) {
    const productIds = details.map(detail => detail.product);

    const products = await Product.find(
      {
        _id: { $in: productIds },
      },
      'price rentPrice',
    );

    const productsMap = new Map(
      products.map(product => [
        product._id.toString(),
        { price: product.price, rentPrice: product.rentPrice },
      ]),
    );

    const amount = details.reduce(
      (sum, { product, quantity, rentalLength }: any) => {
        const productInfo = productsMap.get(product)!;
        return (
          sum +
          (rentalLength && rentalLength > 0
            ? productInfo.rentPrice * rentalLength * quantity
            : productInfo.price * quantity)
        );
      },
      0,
    );

    if (amount < 1)
      throw new ServerError(StatusCodes.BAD_REQUEST, 'Invalid order amount');

    const order = await Order.findOneAndUpdate(
      { user, state: EOrderState.PENDING },
      { $set: { details, customer, amount, state: EOrderState.PENDING } },
      { upsert: true, new: true },
    ).select('_id');

    return { orderId: order._id, amount };
  },
};
