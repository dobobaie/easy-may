import * as express from 'express';
import fs from 'fs';
import multer from 'multer';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';

export const fileUploader = (pathStorage: string) => (
  request: express.Request
): Promise<any> => {
  const multerSingle: express.RequestHandler = multer({
    dest: pathStorage
  }).single('file');
  return new Promise((resolve, reject) => {
    multerSingle(
      request as any,
      undefined as any,
      (async (error: any) => {
        if (error) {
          reject(error);
        }

        // Compress pictures
        await imagemin([request.file.path], {
          destination: pathStorage,
          plugins: [
            imageminGifsicle(),
            imageminJpegtran(),
            imageminPngquant({
              quality: [0.6, 0.8]
            })
          ]
        });

        resolve(null);
      }) as any,
      undefined as any
    );
  });
};

export default fileUploader;
