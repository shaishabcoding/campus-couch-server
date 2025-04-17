import { Router } from 'express';
import { TransactionControllers } from './Transaction.controller';
import purifyRequest from '../../middlewares/purifyRequest';
import { QueryValidations } from '../query/Query.validation';
import Transaction from './Transaction.model';

const router = Router();

router.get('/', purifyRequest(QueryValidations.list), TransactionControllers.list);

router.get(
  "/:transactionId",
  purifyRequest(QueryValidations.exists('transactionId', Transaction)),
  TransactionControllers.retrieve
);

export const TransactionRoutes = router;
