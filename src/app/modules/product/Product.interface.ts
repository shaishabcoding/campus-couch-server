import { Types } from 'mongoose';

export type TProduct = {
  _id?: Types.ObjectId;
  admin: Types.ObjectId;
  name: string;
  images: string[];
  description: string;
  price: number;
  rentPrice: number;
  isRentable: boolean;
  isBuyable: boolean;
  category: string;
  type: string;
  stock: number;
  notes: string[];
  color?: string;
  size?: string;
  materials?: string[];
  refProduct?: Types.ObjectId | string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
};
