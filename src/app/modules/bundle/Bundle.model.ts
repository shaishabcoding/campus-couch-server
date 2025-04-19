import { model, Schema } from 'mongoose';
import { TBundle } from './Bundle.interface';

const bundleSchema = new Schema<TBundle>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
    },
    price: {
      type: Number,
    },
    rentPrice: {
      type: Number,
    },
    isBuyable: {
      type: Boolean,
      required: true,
    },
    isRentable: {
      type: Boolean,
      required: true,
    },
    notes: [String],
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Bundle = model<TBundle>('Bundle', bundleSchema);

export default Bundle;
