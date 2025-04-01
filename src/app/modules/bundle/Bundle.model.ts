import { model, Schema, Types } from 'mongoose';

const bundleSchema = new Schema(
  {
    admin: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    products: {
      type: [Types.ObjectId],
      ref: 'Product',
      required: true,
      default: [],
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
    notes: {
      type: [String],
      required: true,
    },
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
