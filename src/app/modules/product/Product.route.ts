import { Router } from 'express';
import { ProductControllers } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';
import { ProductValidations } from './Product.validation';

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

export const ProductRoutes = {
  admin,
};
