import { Types } from 'mongoose';
import Cart from './Cart.model';
import { TOrderDetails } from '../order/Order.interface';

export const CartServices = {
  async sync(details: TOrderDetails[], user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      {
        $addToSet: {
          details: {
            $each:
              details?.map(detail => ({
                ...detail,
                product: (detail.product as string).oid,
              })) ?? [],
          },
        },
      },
      { upsert: true, new: true },
    )
      .select('details')
      .populate('details.product')
      .lean();
  },

  async remove(productId: string, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      {
        $pull: {
          details: { product: new Types.ObjectId(productId) },
        },
      },
      { new: true },
    )
      .select('details')
      .populate('details.product')
      .lean();
  },
};
