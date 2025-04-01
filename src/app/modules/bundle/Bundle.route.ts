import { Router } from 'express';
import { BundleControllers } from './Bundle.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { BundleValidations } from './Bundle.validation';
import imageUploader from '../../middlewares/imageUploader';

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

export const BundleRoutes = {
  admin,
};
