import { RootFilterQuery } from 'mongoose';
import { EOrderState } from '../order/Order.enum';
import { TTrade } from './Trade.interface';
import Trade from './Trade.model';
import { TUser } from '../user/User.interface';
import { EUserRole } from '../user/User.enum';
import deleteFile from '../../../util/file/deleteFile';
import ServerError from '../../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

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
          totalPages: Math.ceil(total / limit),
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

  async delete(tradeId: string, user: TUser) {
    const trade = (await Trade.findByIdAndDelete(tradeId))!;

    if (user.role !== EUserRole.ADMIN && trade.user !== user._id)
      throw new ServerError(StatusCodes.UNAUTHORIZED, 'You are not authorized to delete this trade.');

    await Trade.findByIdAndDelete(tradeId);

    trade.images?.forEach(deleteFile);
  }
};
