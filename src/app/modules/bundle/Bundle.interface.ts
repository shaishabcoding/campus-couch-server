import { Types } from 'mongoose';

export type TBundle = {
  _id?: Types.ObjectId;
  admin: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  products: Types.ObjectId[];
  price?: number;
  rentPrice?: number;
  isBuyable: boolean;
  isRentable: boolean;
  notes: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
};
