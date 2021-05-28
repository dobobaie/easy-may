import * as express from 'express';
import fs from 'fs';

export const fileStream = (filePath: string) => async (
  request: express.Request
): Promise<any> => {
  const mystream = fs.createReadStream(filePath);
  mystream.pipe(request.res as any);
  await new Promise((resolve, _reject) => {
    mystream.on('end', () => {
      request.res?.end();
      resolve(undefined);
    });
  });
};

export default fileStream;
