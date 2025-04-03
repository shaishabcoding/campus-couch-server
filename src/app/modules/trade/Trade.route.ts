import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { TradeValidations } from './Trade.validation';
import { TradeControllers } from './Trade.controller';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';
import { OrderValidations } from '../order/Order.validation';
import Trade from './Trade.model';

const user = Router();

user.post(
  '/create',
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(TradeValidations.create),
  TradeControllers.create,
);

user.patch(
  '/:tradeId/:state',
  purifyRequest(
    QueryValidations.exists('tradeId', Trade),
    OrderValidations.state('params'),
  ),
  TradeControllers.changeState,
);

export const TradeRoutes = { user };
