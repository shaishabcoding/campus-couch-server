import deleteFile from '../../../util/file/deleteFile';
import { TProduct } from './Product.interface';
import { Product } from './Product.model';

export const ProductServices = {
  async create(productData: TProduct) {
    return await Product.create(productData);
  },

  async edit(productId: string, productData: Partial<TProduct>) {
    const product = (await Product.findById(productId))!;

    const oldImages = product.images;

    Object.assign(product, productData);

    await product.save();

    oldImages?.forEach(deleteFile);

    return product;
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

  async retrieve(productId: string) {
    return await Product.findById(productId);
  },

  async delete(productId: string) {
    const product = (await Product.findByIdAndDelete(productId))!;

    product.images?.forEach(deleteFile);

    return product;
  },
};
