import { Types } from 'mongoose';
import { ETransactionType } from './Transaction.enum';

export type TTransaction = {
  _id?: Types.ObjectId;
  transaction_id?: string;
  order: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  payment_method: string;
  transaction_type: ETransactionType;
  createdAt?: Date;
  updatedAt?: Date;
};
