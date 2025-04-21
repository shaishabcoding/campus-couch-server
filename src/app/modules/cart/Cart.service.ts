import { Types } from 'mongoose';
import Cart from './Cart.model';

export const CartServices = {
  async list(user: Types.ObjectId) {
    return Cart.findOne({ user })
      .select('details')
      .populate('details.product')
      .lean();
  },

  async add(
    {
      product,
      quantity,
      rentalLength,
    }: { product: string; quantity: number; rentalLength: number },
    user: Types.ObjectId,
  ) {
    return Cart.findOneAndUpdate(
      { user },
      {
        $addToSet: {
          details: {
            product: product.oid,
            quantity,
            rentalLength,
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
