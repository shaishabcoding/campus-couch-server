import deleteFile from '../../../util/file/deleteFile';
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
          totalPage: Math.ceil(total / limit),
        },
      },
    };
  },
};
