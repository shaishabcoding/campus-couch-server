import { Types } from 'mongoose';
import { TCustomer } from '../order/Order.interface';
import { ETradeState } from './Trade.enum';

export type TTrade = {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  price: number;
  customer: TCustomer;
  state: ETradeState;
  createdAt?: Date;
  updatedAt?: Date;
};
