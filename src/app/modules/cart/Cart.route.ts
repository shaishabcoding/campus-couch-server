import { Router } from 'express';
import { CartControllers } from './Cart.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { Product } from '../product/Product.model';
import { CardValidations } from './Cart.validation';

const router = Router();

router.patch(
  '/sync',
  purifyRequest(CardValidations.sync),
  CartControllers.sync,
);

router.delete(
  '/:productId/remove',
  purifyRequest(QueryValidations.exists('productId', Product)),
  CartControllers.remove,
);

export const CartRoutes = router;
