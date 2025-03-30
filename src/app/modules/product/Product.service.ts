import { TProduct } from './Product.interface';
import { Product } from './Product.model';

export const ProductServices = {
  async create(productData: TProduct) {
    return await Product.create(productData);
  },

  async edit(productId: string, productData: Partial<TProduct>) {
    return await Product.findByIdAndUpdate(productId, productData, {
      new: true,
    });
  },
};
