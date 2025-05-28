/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef, no-unused-vars */
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { createDir } from '../../util/file/createDir';
import catchAsync from '../../util/server/catchAsync';

/**
 * @description Multer middleware to handle image uploads with optional resizing.
 */
const imageUploader = () => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'images');
  const resizedDir = path.join(uploadDir, 'resized');

  createDir(uploadDir, resizedDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const fileFilter = (_req: any, file: any, cb: FileFilterCallback) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(
          new ServerError(
            StatusCodes.BAD_REQUEST,
            'Only image files are allowed',
          ),
        );

  const upload = multer({
    storage,
    fileFilter,
  }).fields([{ name: 'images', maxCount: 20 }]);

  return catchAsync((req, res, next) => {
    upload(req, res, async err => {
      if (err) next(err);

      const uploadedImages = req.files as { images?: Express.Multer.File[] };

      if (!uploadedImages?.images?.length) return next();

      const resizedImages: string[] = [];

      for (const file of uploadedImages.images) {
        resizedImages.push(`/images/${file.filename}`);
      }

      req.body.images = resizedImages;
      next();
    });
  });
};

export default imageUploader;
