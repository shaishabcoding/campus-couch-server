import { Router } from 'express';
import { ProductControllers } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { ProductValidations } from './Product.validation';
import { QueryValidations } from '../query/Query.validation';
import { Product } from './Product.model';
import { ReviewControllers } from '../review/Review.controller';
import auth from '../../middlewares/auth';
import { EUserRole } from '../user/User.enum';
import { ReviewValidations } from '../review/Review.validation';

const admin = Router();

admin.get('/', ProductControllers.search);

admin.post(
  '/create',
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(ProductValidations.create),
  ProductControllers.create,
);

admin.patch(
  '/:productId/edit',
  purifyRequest(QueryValidations.exists('productId', Product)),
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(ProductValidations.edit),
  ProductControllers.edit,
);

admin.delete(
  '/:productId/delete',
  purifyRequest(QueryValidations.exists('productId', Product)),
  ProductControllers.delete,
);

/** create variant */
admin.post(
  '/:productId/variant',
  purifyRequest(QueryValidations.exists('productId', Product)),
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(ProductValidations.create),
  ProductControllers.create,
);

const user = Router();

user.get(
  '/',
  purifyRequest(QueryValidations.list, ProductValidations.list),
  ProductControllers.list,
);

user.get('/categories/list', ProductControllers.categories);

user.get(
  '/:productId',
  purifyRequest(QueryValidations.exists('productId', Product)),
  ProductControllers.retrieve,
);

user.get(
  '/:productId/reviews',
  purifyRequest(
    QueryValidations.exists('productId', Product),
    QueryValidations.list,
  ),
  ReviewControllers.list,
);

user.patch(
  '/:productId/review',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(
    QueryValidations.exists('productId', Product),
    ReviewValidations.store,
  ),
  ReviewControllers.store,
);

export const ProductRoutes = {
  admin,
  user,
};
