import { model, Schema, Types } from 'mongoose';

const bundleSchema = new Schema(
  {
    admin: {
      type: Types.ObjectId,
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
      type: [Types.ObjectId],
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Bundle = model('Bundle', bundleSchema);

export default Bundle;
