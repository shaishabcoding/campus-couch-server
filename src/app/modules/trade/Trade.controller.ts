import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { TradeServices } from './Trade.service';

export const TradeControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    body.user = user?._id;
    const data = await TradeServices.create(body);

    serveResponse(res, {
      message: 'Trade created successfully!',
      data,
    });
  }),
};
