import { model, Schema, Types } from 'mongoose';
import { EOrderState } from './Order.enum';
import { TCustomer, TOrder } from './Order.interface';

export const customerSchema = new Schema<TCustomer>(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    address: {
      type: {
        country: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        zip: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        apartment: {
          type: String,
          required: true,
        },
      },
      required: true,
      _id: false,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema<TOrder>(
  {
    name: String,
    details: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          rentalLength: Number,
        },
      ],
      _id: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: customerSchema,
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    state: {
      type: String,
      enum: Object.values(EOrderState),
      default: EOrderState.PENDING,
    },
    transaction: {
      type: Types.ObjectId,
      ref: 'Transaction',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Order = model<TOrder>('Order', orderSchema);

export default Order;
