import { Types } from 'mongoose';
import { EOrderState } from './Order.enum';

export type TOrder = {
  details: {
    product: Types.ObjectId;
    quantity: number;
    rentalLength?: number;
  }[];
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
