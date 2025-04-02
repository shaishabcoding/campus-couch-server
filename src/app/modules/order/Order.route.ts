import { Router } from 'express';
import { OrderControllers } from './Order.controller';
import { OrderValidations } from './Order.validation';
import purifyRequest from '../../middlewares/purifyRequest';

const router = Router();

router.post(
  '/checkout',
  purifyRequest(OrderValidations.checkout),
  OrderControllers.checkout,
);

export const OrderRoutes = router;
