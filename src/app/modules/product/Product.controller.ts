import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { ProductServices } from './Product.service';
import { TProduct } from './Product.interface';

export const ProductControllers = {
  create: catchAsync(async ({ body, user, params }, res) => {
    const productData: TProduct = {
      isBuyable: !!body.price,
      isRentable: !!body.rentPrice,
      ...body,
      admin: user!._id!,
    };

    productData.refProduct = params?.productId;

    const data = await ProductServices.create(productData);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Product created successfully!',
      data,
    });
  }),

  edit: catchAsync(async ({ params, body }, res) => {
    const productData: Partial<TProduct> = {};

    if (body.price) productData.isBuyable = true;
    if (body.rentPrice) productData.isRentable = true;

    Object.assign(productData, body);

    const data = await ProductServices.edit(params.productId, productData);

    serveResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Product updated successfully!',
      data,
    });
  }),

  list: catchAsync(async (req, res) => {
    const { meta, products } = await ProductServices.list(req.query);

    serveResponse(res, {
      message: 'Products retrieved successfully!',
      meta,
      data: products,
    });
  }),

  retrieve: catchAsync(async ({ params }, res) => {
    const data = await ProductServices.retrieve(params.productId);

    serveResponse(res, {
      message: 'Product retrieved successfully!',
      data,
    });
  }),

  delete: catchAsync(async ({ params }, res) => {
    await ProductServices.delete(params.productId);

    serveResponse(res, {
      message: 'Product deleted successfully!',
    });
  }),
};
