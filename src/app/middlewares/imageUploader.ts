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
export const imageRetriever = catchAsync(async (req, res) => {
  let filename = req.params.filename.replace(/[^\w.-]/g, '');
  const shouldRedirect = !/\.png$/i.test(filename);

  if (shouldRedirect) filename = `${filename.replace(/\.[a-zA-Z]+$/, '')}.png`;

  const fileExists = await bucket.find({ filename }).hasNext();
  if (!fileExists)
    throw new ServerError(StatusCodes.NOT_FOUND, 'Image not found');

  if (shouldRedirect)
    return res.redirect(
      StatusCodes.MOVED_PERMANENTLY,
      `/images/${encodeURIComponent(filename)}`,
    );

  return new Promise((resolve, reject) => {
    const stream = bucket
      .openDownloadStreamByName(filename)
      .on('error', () =>
        reject(new ServerError(StatusCodes.NOT_FOUND, 'Stream error')),
      )
      .pipe(res)
      .on('finish', resolve);

    res.on('close', () => stream.destroy());
  });
});

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
