import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { TradeValidations } from './Trade.validation';
import { TradeControllers } from './Trade.controller';
import imageUploader from '../../middlewares/imageUploader';

const user = Router();

user.post(
  '/create',
  imageUploader({
    width: 700,
    height: 700,
  }),
  purifyRequest(TradeValidations.create),
  TradeControllers.create,
);

export const TradeRoutes = { user };
