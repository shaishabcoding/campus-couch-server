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

const admin = Router();

admin.post(
  '/create',
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(BundleValidations.create),
  BundleControllers.create,
);

admin.patch(
  '/:bundleId/edit',
  purifyRequest(QueryValidations.exists('bundleId', Bundle)),
  imageUploader({
    width: 700,
    height: 700,
  }),
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
  purifyRequest(QueryValidations.exists('bundleId', Bundle)),
  ReviewControllers.store,
);

export const BundleRoutes = {
  admin,
  user,
};
