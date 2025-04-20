import { RootFilterQuery } from 'mongoose';
import deleteFile from '../../../util/file/deleteFile';
import { TProduct } from './Product.interface';
import { Product } from './Product.model';

export const ProductServices = {
  async create(productData: TProduct) {
    return Product.create(productData);
  },

  async edit(productId: string, productData: Partial<TProduct>) {
    const product = (await Product.findById(productId))!;

    const oldImages = product.images;

    Object.assign(product, productData);

    await product.save();

    if (productData?.images) oldImages?.forEach(deleteFile);

    return product;
  },

  async list({
    page,
    limit,
    sort,
    categories,
    colors,
    minPrice,
    maxPrice,
    sizes,
    materials,
    isBuyable,
    isRentable,
  }: Record<string, any>) {
    const filter: RootFilterQuery<TProduct> = {};

    if (categories) filter.category = { $in: categories, $exists: true };
    if (colors) filter.color = { $in: colors, $exists: true };
    if (minPrice !== undefined) filter.price = { $gte: minPrice };
    if (maxPrice !== undefined)
      filter.price = { ...filter.price, $lte: maxPrice };
    if (sizes) filter.size = { $in: sizes, $exists: true };
    if (materials) filter.materials = { $in: materials, $exists: true };
    if (isBuyable !== undefined) filter.isBuyable = isBuyable;
    if (isRentable !== undefined) filter.isRentable = isRentable;

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    return {
      products,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        filters: await this.availableFilters(),
        current: {
          sort,
          categories,
          colors,
          minPrice,
          maxPrice,
          sizes,
          materials,
          isBuyable,
          isRentable,
        },
      },
    };
  },

  async availableFilters() {
    const [categories, colors, sizes, materials, priceRange] =
      await Promise.all([
        Product.distinct('category'),
        Product.distinct('color'),
        Product.distinct('size'),
        Product.distinct('materials'),
        Product.aggregate([
          {
            $group: {
              _id: null,
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
            },
          },
        ]),
      ]);

    const minPrice = priceRange[0]?.minPrice;
    const maxPrice = priceRange[0]?.maxPrice;

    return {
      categories,
      colors,
      minPrice,
      maxPrice,
      sizes,
      materials,
      availities: ['isBuyable', 'isRentable'],
    };
  },

  async retrieve(productId: string) {
    return Product.findById(productId);
  },

  async delete(productId: string) {
    const product = (await Product.findByIdAndDelete(productId))!;

    product.images?.forEach(deleteFile);

    return product;
  },

  async search() {
    return Product.find().select('name images');
  },

  async relatedProducts(productId: string) {
    const product = (await Product.findById(productId).populate('category'))!;

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: productId },
    }).limit(4);

    return relatedProducts;
  },
};
