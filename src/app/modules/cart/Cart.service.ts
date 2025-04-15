import { Types } from 'mongoose';
import Cart from './Cart.model';

export const CartServices = {
  async sync(productIds: string[], user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $addToSet: { products: { $each: productIds } } },
      { upsert: true, new: true },
    )
      .select('products')
      .populate('products')
      .lean();
  },

  async remove(productId: string, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $pull: { products: productId } },
      { upsert: true, new: true },
    ).lean();
  },
};
