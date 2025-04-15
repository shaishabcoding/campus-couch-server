import { Router } from 'express';
import { OrderControllers } from './Order.controller';
import { OrderValidations } from './Order.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Order from './Order.model';

const router = Router();

router.get(
  '/',
  purifyRequest(QueryValidations.list, OrderValidations.state('query', true)),
  OrderControllers.list,
);

router.get(
  '/:orderId',
  purifyRequest(QueryValidations.exists('orderId', Order)),
  OrderControllers.retrieve,
);

router.post(
  '/checkout',
  purifyRequest(OrderValidations.checkout),
  OrderControllers.checkout,
);

router.patch(
  '/:orderId/:state',
  purifyRequest(
    QueryValidations.exists('orderId', Order),
    OrderValidations.state('params'),
  ),
  OrderControllers.changeState,
);

export const OrderRoutes = router;
