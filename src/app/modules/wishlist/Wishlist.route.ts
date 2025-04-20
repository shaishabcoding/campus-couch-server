import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import { Product } from '../product/Product.model';
import { WishlistControllers } from './Wishlist.controller';
import { WishlistValidations } from './Wishlist.validation';

const router = Router();

router.post(
  '/:productId',
  purifyRequest(QueryValidations.exists('productId', Product)),
  WishlistControllers.add,
);

router.patch(
  '/sync',
  purifyRequest(WishlistValidations.sync),
  WishlistControllers.sync,
);

router.delete(
  '/:productId/remove',
  purifyRequest(QueryValidations.exists('productId', Product)),
  WishlistControllers.remove,
);

export const WishlistRoutes = router;
