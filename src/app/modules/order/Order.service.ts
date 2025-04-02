import { Types } from 'mongoose';
import { TOrder } from './Order.interface';
import { Product } from '../product/Product.model';
import Order from './Order.model';
import { EOrderState } from './Order.enum';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import Bundle from '../bundle/Bundle.model';

export const OrderServices = {
  async checkout({ details, customer }: TOrder, user: Types.ObjectId) {
    const productIds = details.map(({ product }) => product);

    const products = await Product.find(
      { _id: { $in: productIds } },
      'name price rentPrice',
    );

    const productsMap = new Map(
      products.map(({ _id, price, rentPrice }) => [
        _id.toString(),
        { price, rentPrice },
      ]),
    );

    let amount;

    try {
      amount = details.reduce(
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

      if (amount < 1) throw Error;
    } catch {
      throw new ServerError(StatusCodes.BAD_REQUEST, 'Order is not available');
    }

    const order = await Order.findOneAndUpdate(
      { user, state: EOrderState.PENDING },
      {
        $set: {
          name: products[0].name,
          details,
          customer,
          amount,
          state: EOrderState.PENDING,
        },
      },
      { upsert: true, new: true },
    ).populate('details.product', 'name');

    return { order, amount };
  },

  async bundleCheckout(
    { bundleId, quantity, rentalLength, customer }: any,
    user: Types.ObjectId,
  ) {
    const { products, rentPrice, price, name } =
      (await Bundle.findById(bundleId).select('-images'))!;

    const details = products.map(productId => ({
      product: productId,
      quantity,
      rentalLength,
    }));

    let amount;

    try {
      amount = (rentalLength ? rentPrice! * rentalLength : price!) * quantity;

      if (amount < 1) throw Error;
    } catch {
      throw new ServerError(StatusCodes.BAD_REQUEST, 'Order is not available');
    }

    const order = await Order.findOneAndUpdate(
      { user, state: EOrderState.PENDING },
      { $set: { name, details, customer, amount, state: EOrderState.PENDING } },
      { upsert: true, new: true },
    ).populate('details.product', 'name');

    return { order, amount };
  },
};
