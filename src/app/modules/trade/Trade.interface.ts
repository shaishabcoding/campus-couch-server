import { Types } from 'mongoose';
import { TCustomer } from '../order/Order.interface';
import { EOrderState } from '../order/Order.enum';

export type TTrade = {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  price: number;
  seller: TCustomer;
  state: EOrderState;
  createdAt?: Date;
  updatedAt?: Date;
};
