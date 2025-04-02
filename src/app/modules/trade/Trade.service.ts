import { TTrade } from './Trade.interface';
import Trade from './Trade.model';

export const TradeServices = {
  async create(tradeData: TTrade) {
    return Trade.create(tradeData);
  },
};
