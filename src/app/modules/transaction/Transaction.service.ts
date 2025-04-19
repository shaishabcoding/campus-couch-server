import { TTransaction } from './Transaction.interface';
import Transaction from './Transaction.model';

export const TransactionServices = {
  async create(transactionData: TTransaction) {
    return Transaction.create(transactionData);
  },

  async list({ page = 1, limit = 10 }: Record<string, any>) {
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $facet: {
          paginatedResults: [
            { $sort: { createdAt: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'count' }],
          totalBuy: [
            { $match: { transaction_type: 'buy' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ],
          totalSell: [
            { $match: { transaction_type: 'sell' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ],
          yearlyEarnings: [
            {
              $group: {
                _id: { $month: '$createdAt' },
                totalBuy: {
                  $sum: { $cond: [{ $eq: ['$transaction_type', 'buy'] }, '$amount', 0] },
                },
                totalSell: {
                  $sum: { $cond: [{ $eq: ['$transaction_type', 'sell'] }, '$amount', 0] },
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ];

    const result = (await Transaction.aggregate(pipeline))[0];

    const transactions = result?.paginatedResults || [];
    const total = result?.totalCount[0]?.count || 0;
    const totalBuy = result?.totalBuy[0]?.total || 0;
    const totalSell = result?.totalSell[0]?.total || 0;
    const totalEarnings = totalSell - totalBuy;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const yearlyEarnings = months.reduce((acc, month, index) => {
      const data = result[0]?.yearlyEarnings.find(
        (e: any) => e._id === index + 1
      ) || {
        totalBuy: 0,
        totalSell: 0,
      };

      const totalEarningsForMonth = data.totalSell - data.totalBuy;

      (acc as any)[month] = {
        buys: data.totalBuy.toFixed(2),
        sells: data.totalSell.toFixed(2),
        earnings: totalEarningsForMonth.toFixed(2),
      };

      return acc;
    }, {});


    return {
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        total: {
          buys: totalBuy.toFixed(2),
          sells: totalSell.toFixed(2),
          earnings: totalEarnings.toFixed(2),
        },
        yearlyEarnings,
      },
      transactions,
    };
  },

  async retrieve(transactionId: string) {
    return Transaction.findById(transactionId).populate('user', 'name avatar email');
  },
};
