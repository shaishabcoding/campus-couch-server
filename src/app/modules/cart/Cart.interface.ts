import { Types } from 'mongoose';
import { TOrderDetails } from '../order/Order.interface';

export type TCart = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  details: TOrderDetails[];
};
