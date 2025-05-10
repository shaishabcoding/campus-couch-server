import { model, Schema } from 'mongoose';
import { TWishlist } from './Wishlist.interface';

const wishlistSchema = new Schema<TWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  },
);

const Wishlist = model<TWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
