import { Router } from 'express';
import { OrderControllers } from './Order.controller';
import { OrderValidations } from './Order.validation';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Order from './Order.model';

const router = Router();

router.post(
  '/checkout',
  purifyRequest(OrderValidations.checkout),
  OrderControllers.checkout,
);

router.patch(
  '/:orderId/:state',
  purifyRequest(
    QueryValidations.exists('orderId', Order),
    OrderValidations.state,
  ),
  OrderControllers.changeState,
);

export const OrderRoutes = router;
