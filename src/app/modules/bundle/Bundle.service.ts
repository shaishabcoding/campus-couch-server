import deleteFile from '../../../util/file/deleteFile';
import { Product } from '../product/Product.model';
import { TBundle } from './Bundle.interface';
import Bundle from './Bundle.model';

export const BundleServices = {
  async create(bundleData: TBundle) {
    return Bundle.create(bundleData);
  },

  async edit(bundleId: string, bundleData: Partial<TBundle>) {
    const bundle = (await Bundle.findById(bundleId))!;

    const oldImages = bundle.images;

    Object.assign(bundle, bundleData);

    await bundle.save();

    if (bundleData?.images) oldImages?.forEach(deleteFile);

    return bundle;
  },

  async delete(bundleId: string) {
    const bundle = (await Bundle.findByIdAndDelete(bundleId))!;

    bundle.images?.forEach(deleteFile);

    return bundle;
  },

  async list({ page, limit }: Record<string, any>) {
    const bundles = await Bundle.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Bundle.countDocuments();

    return {
      bundles,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  },

  async retrieve(bundleId: string) {
    return Bundle.findById(bundleId).populate('products', 'name images');
  },

  async relatedProducts(bundleId: string) {
    const bundle = (await Bundle.findById(bundleId).populate('products'))!;

    const categories = bundle.products.map((product: any) => product.category);

    const uniqueCategories = [...new Set(categories)];

    const relatedProducts = await Product.find({
      category: { $in: uniqueCategories },
    }).limit(4);

    return relatedProducts;
  },
};
