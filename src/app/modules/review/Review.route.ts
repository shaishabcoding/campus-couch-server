import { Router } from 'express';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Review from './Review.model';
import { ReviewControllers } from './Review.controller';

export default Router().delete(
  '/:reviewId/delete',
  purifyRequest(QueryValidations.exists('reviewId', Review)),
  ReviewControllers.delete,
);
