import { RootFilterQuery } from 'mongoose';
import { EOrderState } from '../order/Order.enum';
import { TTrade } from './Trade.interface';
import Trade from './Trade.model';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';

export const TradeServices = {
  async create(tradeData: TTrade) {
    return Trade.create(tradeData);
  },

  async changeState(tradeId: string, state: EOrderState) {
    return Trade.findByIdAndUpdate(tradeId, { state }, { new: true });
  },

  async list({ state, page, limit }: Record<any, any>, user: TUser) {
    const filter: RootFilterQuery<TTrade> = state ? { state } : {};

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    const trades = await Trade.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Trade.countDocuments(filter);

    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      trades,
    };
  },

  async retrieve(tradeId: string, user: TUser) {
    const filter: RootFilterQuery<TTrade> = {
      _id: tradeId,
    };

    if (user.role !== EUserRole.ADMIN) filter.user = user._id;

    return Trade.findOne(filter);
  },
};
