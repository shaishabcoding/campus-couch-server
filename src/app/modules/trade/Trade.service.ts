import { EOrderState } from '../order/Order.enum';
import { TTrade } from './Trade.interface';
import Trade from './Trade.model';

export const TradeServices = {
  async create(tradeData: TTrade) {
    return Trade.create(tradeData);
  },

  async changeState(tradeId: string, state: EOrderState) {
    return Trade.findByIdAndUpdate(tradeId, { state }, { new: true });
  },
};
