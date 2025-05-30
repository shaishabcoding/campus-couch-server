import { Router } from 'express';
import { BundleControllers } from './Bundle.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { BundleValidations } from './Bundle.validation';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';
import Bundle from './Bundle.model';
import { ReviewControllers } from '../review/Review.controller';
import { EUserRole } from '../user/User.enum';
import auth from '../../middlewares/auth';
import { OrderControllers } from '../order/Order.controller';
import { OrderValidations } from '../order/Order.validation';
import { PaymentValidations } from '../payment/Payment.validation';
import { ReviewValidations } from '../review/Review.validation';

const admin = Router();

admin.post(
  '/create',
  imageUploader(),
  purifyRequest(BundleValidations.create),
  BundleControllers.create,
);

admin.patch(
  '/:bundleId/edit',
  purifyRequest(QueryValidations.exists('bundleId', Bundle)),
  imageUploader(),
  purifyRequest(BundleValidations.edit),
  BundleControllers.edit,
);

admin.delete(
  '/:bundleId/delete',
  purifyRequest(QueryValidations.exists('bundleId', Bundle)),
  BundleControllers.delete,
);

const user = Router();

user.get('/', purifyRequest(QueryValidations.list), BundleControllers.list);

user.get(
  '/:bundleId',
  purifyRequest(QueryValidations.exists('bundleId', Bundle)),
  BundleControllers.retrieve,
);

user.get(
  '/:bundleId/reviews',
  purifyRequest(
    QueryValidations.exists('bundleId', Bundle),
    QueryValidations.list,
  ),
  ReviewControllers.list,
);

user.patch(
  '/:bundleId/review',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(
    QueryValidations.exists('bundleId', Bundle),
    ReviewValidations.store,
  ),
  ReviewControllers.store,
);

user.post(
  '/:bundleId/checkout',
  auth(EUserRole.USER, EUserRole.ADMIN),
  purifyRequest(
    QueryValidations.exists('bundleId', Bundle),
    OrderValidations.bundleCheckout,
    PaymentValidations.method,
  ),
  OrderControllers.checkout,
);

export const BundleRoutes = {
  admin,
  user,
};
