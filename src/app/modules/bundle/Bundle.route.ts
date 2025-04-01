import { Router } from 'express';
import { BundleControllers } from './Bundle.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { BundleValidations } from './Bundle.validation';
import imageUploader from '../../middlewares/imageUploader';
import { QueryValidations } from '../query/Query.validation';
import Bundle from './Bundle.model';

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

export const BundleRoutes = {
  admin,
};
