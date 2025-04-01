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
};
