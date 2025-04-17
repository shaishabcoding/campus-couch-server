import catchAsync from '../../../util/server/catchAsync';
import { TransactionServices } from './Transaction.service';
import serveResponse from '../../../util/server/serveResponse';

export const TransactionControllers = {
  list: catchAsync(async ({ query }, res) => {
    const { meta, transactions } = await TransactionServices.list(query);

    serveResponse(res, {
      message: 'Transactions retrieved successfully.',
      meta,
      data: transactions,
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await TransactionServices.retrieve(params.transactionId);

    serveResponse(res, {
      message: 'Transaction retrieved successfully.',
      data,
    })
  })
};
