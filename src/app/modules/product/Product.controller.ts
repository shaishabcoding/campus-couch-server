import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ProductServices } from './Product.service';
import { TProduct } from './Product.interface';

export const ProductControllers = {
  create: catchAsync(async ({ body, user }, res) => {
    const productData: TProduct = {
      ...body,
      user: user!._id!,
      isBuyable: !!body.price,
      isRentable: !!body.rentPrice,
    };

    const data = await ProductServices.create(productData);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Product created successfully!',
      data,
    });
  }),
};
