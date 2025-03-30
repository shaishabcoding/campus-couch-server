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

  async list({ page, limit }: Record<string, any>) {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments();

    return {
      products,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
    };
  },
};
