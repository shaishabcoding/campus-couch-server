import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { TradeValidations } from './Trade.validation';
import { TradeControllers } from './Trade.controller';

const user = Router();

user.post(
  '/create',
  purifyRequest(TradeValidations.create),
  TradeControllers.create,
);

export const TradeRoutes = { user };
