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
      [
        {
          $set: {
            details: {
              $let: {
                vars: {
                  currentDetails: { $ifNull: ['$details', []] },
                  existing: {
                    $filter: {
                      input: { $ifNull: ['$details', []] },
                      as: 'item',
                      cond: { $eq: ['$$item.product', details?.product] },
                    },
                  },
                },
                in: {
                  $cond: [
                    { $gt: [{ $size: '$$existing' }, 0] },
                    {
                      $map: {
                        input: '$$currentDetails',
                        as: 'item',
                        in: {
                          $cond: [
                            { $eq: ['$$item.product', details?.product] },
                            {
                              $mergeObjects: ['$$item', details],
                            },
                            '$$item',
                          ],
                        },
                      },
                    },
                    {
                      $concatArrays: ['$$currentDetails', [details]],
                    },
                  ],
                },
              },
            },
          },
        },
      ],
      {
        new: true,
        upsert: true,
      },
    );
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
