import * as express from 'express';
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
  return new Promise((resolve, reject) =>
    multerSingle(
      <Error & express.Request>request,
      <express.Request & express.Response>request.res,
      (async (error: any) => {
        if (error) {
          reject(error);
        }
        if (!request.file) {
          throw new Error('wrong_file_body');
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
      }) as any
    )
  );
};

export default fileUploader;
