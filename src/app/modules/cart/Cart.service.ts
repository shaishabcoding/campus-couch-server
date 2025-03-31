import { Types } from 'mongoose';
import Cart from './Cart.model';

export const CartServices = {
  async add(product: string, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $addToSet: { products: product } },
      { upsert: true, new: true },
    ).lean();
  },

  async retrieve(user: Types.ObjectId) {
    return Cart.findOne({ user })
      .select('products')
      .populate('products')
      .lean();
  },

  async remove(product: string, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $pull: { products: product } },
      { upsert: true, new: true },
    ).lean();
  },
};
