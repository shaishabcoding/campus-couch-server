import { Types } from 'mongoose';

export type TWishlist = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  products: string[];
};
