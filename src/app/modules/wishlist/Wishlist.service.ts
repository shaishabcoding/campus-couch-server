import { Types } from 'mongoose';
import Wishlist from './Wishlist.model';

export const WishlistServices = {
  async list(user: Types.ObjectId) {
    return Wishlist.findOne({ user })
      .select('products')
      .populate('products')
      .lean();
  },

  async add(productId: string, user: Types.ObjectId) {
    return Wishlist.findOneAndUpdate(
      { user },
      { $addToSet: { products: productId } },
      { upsert: true, new: true },
    ).lean();
  },

  async remove(productId: string, user: Types.ObjectId) {
    return Wishlist.findOneAndUpdate(
      { user },
      { $pull: { products: productId } },
      { upsert: true, new: true },
    ).lean();
  },

  async exists(productId: string, user: Types.ObjectId) {
    return Wishlist.exists({ user, products: productId });
  },
};
