import { Router } from 'express';
import { ProductControllers } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { ProductValidations } from './Product.validation';
import { QueryValidations } from '../query/Query.validation';
import { Product } from './Product.model';

const admin = Router();

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

user.get('/', purifyRequest(QueryValidations.list), ProductControllers.list);

user.get(
  '/:productId',
  purifyRequest(QueryValidations.exists('productId', Product)),
  ProductControllers.retrieve,
);

export const ProductRoutes = {
  admin,
  user,
};
