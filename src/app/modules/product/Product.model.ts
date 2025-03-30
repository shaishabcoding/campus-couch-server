import { model, Schema } from 'mongoose';
import { TProduct } from './Product.interface';

const productSchema = new Schema<TProduct>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
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
      required: true,
    },
    type: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: [String],
      required: true,
    },
    refProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Product = model<TProduct>('Product', productSchema);
