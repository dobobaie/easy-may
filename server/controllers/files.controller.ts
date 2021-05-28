import {
  Controller,
  Get,
  Path,
  Post,
  Delete,
  Route,
  Request,
  Security,
  SuccessResponse
} from 'tsoa';
import * as express from 'express';

import { IConfig } from '../app/config';
import Provider from '../provider';
import Services from '../services';

import fileUploader from '../middlewares/file-uploader.middleware';
import fileStream from '../middlewares/file-stream.middleware';

@Route('files')
export class FilesController extends Controller {
  @SuccessResponse('201', 'OK')
  @Security('privateAccess')
  @Post('file')
  public async createFile(
    @Request() request: express.Request
  ): Promise<{
    filename: string;
  }> {
    const config: IConfig = Provider.get<IConfig>('config');
    await fileUploader(config.storage.path)(request);
    const filename: string = await Services.files.createOne(request.file);
    return { filename };
  }

  @Security('privateAccess')
  @Get('file/{filename}')
  public async getFile(
    @Path() filename: string
  ): Promise<{
    id: string;
  }> {
    const file: {
      id: string;
    } = await Services.files.retrieveByFilename(filename);
    return { id: file.id };
  }

  @Get('file/{filename}/raw')
  public async getFileRaw(
    @Request() request: express.Request,
    @Path() filename: string
  ): Promise<void> {
    const file: {
      path: string;
      mimetype: string;
    } = await Services.files.retrieveByFilename(filename);
    request.res?.setHeader('Content-type', file.mimetype);
    await fileStream(file.path)(request);
  }

  @SuccessResponse('201', 'OK')
  @Security('privateAccess')
  @Delete('file/{filename}')
  public async deleteFile(@Path() filename: string): Promise<void> {
    await Services.files.deleteOne(filename);
  }
}
