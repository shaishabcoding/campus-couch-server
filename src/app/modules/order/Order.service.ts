import { RootFilterQuery, Types } from 'mongoose';
import { TOrder } from './Order.interface';
import { Product } from '../product/Product.model';
import Order from './Order.model';
import { EOrderState } from './Order.enum';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';
import Bundle from '../bundle/Bundle.model';
import { EUserRole } from '../user/User.enum';
import { TUser } from '../user/User.interface';

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
    )
      .select('customer details name amount')
      .populate('details.product', 'name');

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
    )
      .select('customer details name amount')
      .populate('details.product', 'name');

    return { order, amount };
  },

  async changeState(orderId: string, state: EOrderState) {
    return await Order.findByIdAndUpdate(orderId, { state }, { new: true })
      .populate('details.product', 'name images')
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );
  },

  async list({ state, page, limit }: Record<any, any>, user: TUser) {
    const filter: RootFilterQuery<TOrder> = state ? { state } : {};

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    const orders = await Order.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('details.product', 'title images')
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );

    const total = await Order.countDocuments(filter);

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      orders,
    };
  },

  async retrieve(orderId: string, user: TUser) {
    const filter: RootFilterQuery<TOrder> = {
      _id: orderId,
    };

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    return await Order.findOne(filter)
      .populate('details.product', 'title images')
      .populate(
        'transaction',
        'transaction_id amount payment_method createdAt',
      );
  },
};
