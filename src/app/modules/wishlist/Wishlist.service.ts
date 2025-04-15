import { Types } from 'mongoose';
import Wishlist from './Wishlist.model';

export const WishlistServices = {
  async sync(productIds: string[], user: Types.ObjectId) {
    return Wishlist.findOneAndUpdate(
      { user },
      { $addToSet: { products: { $each: productIds } } },
      { upsert: true, new: true },
    )
      .select('products')
      .populate('products')
      .lean();
  },

  async remove(productId: string, user: Types.ObjectId) {
    return Wishlist.findOneAndUpdate(
      { user },
      { $pull: { products: productId } },
      { upsert: true, new: true },
    ).lean();
  },
};
