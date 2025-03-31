import { model, Schema } from 'mongoose';
import { TCart } from './Cart.interface';

export const cartSchema = new Schema<TCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

const Cart = model<TCart>('Cart', cartSchema);

export default Cart;
