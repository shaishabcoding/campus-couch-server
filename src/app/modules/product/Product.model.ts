import { model, Schema } from 'mongoose';
import { TProduct } from './Product.interface';

const productSchema = new Schema<TProduct>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      select: false,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: [String],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    rentPrice: {
      type: Number,
    },
    isRentable: {
      type: Boolean,
    },
    isBuyable: {
      type: Boolean,
    },
    category: {
      type: String,
    },
    type: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: [String],
    refProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    color: String,
    size: String,
    materials: [String],
    height: String,
    width: String,
    length: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Product = model<TProduct>('Product', productSchema);
