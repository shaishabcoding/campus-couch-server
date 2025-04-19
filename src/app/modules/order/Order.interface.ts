import { Types } from 'mongoose';
import { EOrderState } from './Order.enum';

export type TOrderDetails = {
  product: Types.ObjectId | string;
  quantity: number;
  rentalLength: number;
};

export type TOrder = {
  _id?: Types.ObjectId;
  name?: string;
  details: TOrderDetails[];
  user: Types.ObjectId;
  customer: TCustomer;
  amount: number;
  state: EOrderState;
  transaction?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type TCustomer = {
  name: string;
  contact: string;
  address: {
    country: string;
    city: string;
    zip: string;
    street: string;
  };
};
