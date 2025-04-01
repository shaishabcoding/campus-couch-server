import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { BundleServices } from './Bundle.service';

export const BundleControllers = {
  create: catchAsync(async ({ body }, res) => {
    const data = await BundleServices.create(body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Bundle created successfully!',
      data,
    });
  }),
};
