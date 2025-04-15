import { model } from 'mongoose';
import { TCart } from '../cart/Cart.interface';
import { cartSchema } from '../cart/Cart.model';

const Wishlist = model<TCart>('Wishlist', cartSchema);

export default Wishlist;
