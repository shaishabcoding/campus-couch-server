import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { TradeValidations } from './Trade.validation';
import { TradeControllers } from './Trade.controller';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';
import { OrderValidations } from '../order/Order.validation';
import Trade from './Trade.model';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list, OrderValidations.state('query', true)),
  TradeControllers.list,
);

router.get(
  '/:tradeId',
  purifyRequest(QueryValidations.exists('tradeId', Trade)),
  TradeControllers.retrieve,
);

router.post(
  '/create',
  imageUploader(),
  purifyRequest(TradeValidations.create),
  TradeControllers.create,
);

router.patch(
  '/:tradeId/:state',
  purifyRequest(
    QueryValidations.exists('tradeId', Trade),
    OrderValidations.state('params'),
  ),
  TradeControllers.changeState,
);

router.delete(
  '/:tradeId/delete',
  purifyRequest(QueryValidations.exists('tradeId', Trade)),
  TradeControllers.delete,
);

export const TradeRoutes = router;
