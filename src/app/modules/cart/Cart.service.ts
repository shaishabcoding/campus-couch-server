import { Types } from 'mongoose';
import Cart from './Cart.model';
import { TOrderDetails } from '../order/Order.interface';

export const CartServices = {
  async list(user: Types.ObjectId) {
    return Cart.findOne({ user })
      .select('details')
      .populate('details.product')
      .lean();
  },

  async add(details: TOrderDetails, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $addToSet: { details } },
      { upsert: true, new: true },
    )
      .select('details')
      .populate('details.product')
      .lean();
  },

  async remove(product: Types.ObjectId, user: Types.ObjectId) {
    return Cart.findOneAndUpdate(
      { user },
      { $pull: { details: { product } } },
      { new: true },
    )
      .select('details')
      .populate('details.product')
      .lean();
  },
};
