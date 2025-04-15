import { Types } from 'mongoose';

export type TReview = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  content: string;
  product?: Types.ObjectId;
  bundle?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
