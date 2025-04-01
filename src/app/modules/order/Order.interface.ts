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
  state: EOrderState;
  transaction?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type TCustomer = {
  email: string;
  name: string;
  address: {
    country: string;
    city: string;
    zip: string;
    street: string;
  };
};
