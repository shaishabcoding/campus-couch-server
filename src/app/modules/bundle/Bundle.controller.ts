import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { BundleServices } from './Bundle.service';
import { TBundle } from './Bundle.interface';

export const BundleControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const bundleData: TBundle = {
      isBuyable: !!body.price,
      isRentable: !!body.rentPrice,
      ...body,
      admin: user?._id,
    };

    const data = await BundleServices.create(bundleData);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Bundle created successfully!',
      data,
    });
  }),

  edit: catchAsync(async ({ params, body }, res) => {
    const bundleData: Partial<TBundle> = {};

    if (body.price) bundleData.isBuyable = true;
    if (body.rentPrice) bundleData.isRentable = true;

    Object.assign(bundleData, body);

    const data = await BundleServices.edit(params.bundleId, bundleData);

    serveResponse(res, {
      message: 'Bundle updated successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await BundleServices.delete(params.bundleId);

    serveResponse(res, {
      message: 'Bundle deleted successfully!',
    });
  }),

  list: catchAsync(async (req, res) => {
    const { bundles, meta } = await BundleServices.list(req.query);

    serveResponse(res, {
      message: 'Bundles retrieved successfully!',
      data: bundles,
      meta,
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await BundleServices.retrieve(params.bundleId);

    const related = await BundleServices.relatedProducts(params.bundleId);

    serveResponse(res, {
      message: 'Bundle retrieved successfully!',
      data,
      meta: {
        related,
      },
    });
  }),
};
