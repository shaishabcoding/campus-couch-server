import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { Product } from '../product/Product.model';
import { WishlistControllers } from './Wishlist.controller';

const router = Router();

router.get('/', WishlistControllers.list);

router.get(
  '/exists/:productId',
  purifyRequest(QueryValidations.exists('productId', Product)),
  WishlistControllers.exists,
);

router.post(
  '/:productId',
  purifyRequest(QueryValidations.exists('productId', Product)),
  WishlistControllers.add,
);

router.delete(
  '/:productId/remove',
  purifyRequest(QueryValidations.exists('productId', Product)),
  WishlistControllers.remove,
);

export const WishlistRoutes = router;
