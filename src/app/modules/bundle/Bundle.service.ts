import { TBundle } from './Bundle.interface';
import Bundle from './Bundle.model';

export const BundleServices = {
  async create(bundleData: TBundle) {
    return Bundle.create(bundleData);
  },
};
