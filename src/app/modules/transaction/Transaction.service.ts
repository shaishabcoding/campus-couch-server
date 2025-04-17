import { TTransaction } from './Transaction.interface';
import Transaction from './Transaction.model';

export const TransactionServices = {
  async create(transactionData: TTransaction) {
    return Transaction.create(transactionData);
  },

  async list({ page = 1, limit = 10 }: Record<string, any>) {
    const transactions = await Transaction.find()
      .populate('user', 'name avatar email')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Transaction.countDocuments();

    return {
      transactions,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    };
  },

  async retrieve(transactionId: string) {
    return Transaction.findById(transactionId).populate('user', 'name avatar email');
  },
};
