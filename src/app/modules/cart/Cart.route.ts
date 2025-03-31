import { Router } from 'express';
import { CartControllers } from './Cart.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { Product } from '../product/Product.model';
const router = Router();

router.get('/', CartControllers.retrieve);

router.post(
  '/:productId/add',
  purifyRequest(QueryValidations.exists('productId', Product)),
  CartControllers.add,
);

router.delete(
  '/:productId/remove',
  purifyRequest(QueryValidations.exists('productId', Product)),
  CartControllers.remove,
);

export const CartRoutes = router;
