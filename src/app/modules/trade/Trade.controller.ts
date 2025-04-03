import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { EOrderState } from '../order/Order.enum';
import { EUserRole } from '../user/User.enum';
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

  changeState: catchAsync(async ({ params, user }, res) => {
    if (user?.role !== EUserRole.ADMIN) params.state = EOrderState.CANCEL;

    const data = await TradeServices.changeState(
      params.tradeId,
      params.state as EOrderState,
    );

    serveResponse(res, {
      message: `Trade ${params.state} successfully!`,
      data,
    });
  }),
};
