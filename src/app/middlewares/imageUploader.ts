import type { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer, { FileFilterCallback } from 'multer';
import ServerError from '../../errors/ServerError';
import catchAsync from '../../util/server/catchAsync';
import config from '../../config';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

/**
 * @description Multer middleware to handle image uploads to MongoDB GridFS
 */
const imageUploader = () =>
  catchAsync(async (req, res, next) => {
    await new Promise<void>((resolve, reject) =>
      upload(req, res, err => (err ? reject(err) : resolve())),
    );

    const files = req.files as { images?: Express.Multer.File[] };
    if (files?.images?.length)
      req.body.images = files.images.map(
        ({ filename }) => `/images/${filename}`,
      );

    next();
  });

export default imageUploader;

/**
 * @description Retrieves an image from MongoDB GridFS
 */
export const imageRetriever = catchAsync(
  async (req, res) =>
    new Promise((resolve, reject) =>
      bucket
        .openDownloadStreamByName(req.params.filename)
        .on('error', () =>
          reject(new ServerError(StatusCodes.NOT_FOUND, 'Image not found')),
        )
        .pipe(res)
        .on('end', resolve),
    ),
);

/**
 * @description Deletes an image from MongoDB GridFS
 */
export const deleteImage = async (filename: string) =>
  Promise.all(
    (await bucket.find({ filename }).toArray())?.map(({ _id }) =>
      bucket.delete(_id),
    ),
  );

const storage = new GridFsStorage({
  url: config.url.database,
  file: (req, { originalname }) => ({
    filename: `${originalname
      .replace(/\..+$/, '')
      .replace(/[^\w]+/g, '-')
      .toLowerCase()}-${Date.now()}.png`,
    bucketName: 'images',
    metadata: { uploadedBy: req.user?._id, originalName: originalname },
  }),
});

const fileFilter = (
  _: any,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    /^image\/.+/i.test(file.mimetype) ||
    /\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/i.test(file.originalname)
  )
    return cb(null, true);
  cb(
    new ServerError(
      StatusCodes.BAD_REQUEST,
      `${file.originalname} is not a valid image file`,
    ),
  );
};

const upload = multer({ storage, fileFilter }).fields([{ name: 'images' }]);

const bucket = new GridFSBucket(mongoose.connection.db!, {
  bucketName: 'images',
});
