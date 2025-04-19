import { model, Schema } from 'mongoose';
import { TCart } from './Cart.interface';

export const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
  },
  {
    versionKey: false,
  },
);

const Cart = model<TCart>('Cart', cartSchema);

export default Cart;
