import fs from 'fs';

import { AServices } from './Abstract';

import { initEntry } from '../backend-lib/entities/Abstract';
import { Files } from '../backend-lib/entities/cloud/files.entity';
import Orm from '../backend-lib/repositories/cloud';
import { ICreateFile, IRetrieveFile } from '../models/files.model';

export default class FilesService extends AServices {
  /**
   * @name: createOne
   **/
  public async createOne(_file: ICreateFile): Promise<string> {
    const file: Files = await Orm.files.createOne({
      ...initEntry(),
      ..._file
    });
    return file.filename;
  }

  /**
   * @name: retrieveByFilename
   **/
  public async retrieveByFilename(filename: string): Promise<IRetrieveFile> {
    const file: Files | undefined = await Orm.files.retrieveByFilename(
      filename
    );
    if (!file) {
      throw new Error('file_not_found');
    }
    return file;
  }

  /**
   * @name: deleteOne
   **/
  public async deleteOne(filename: string): Promise<void> {
    const file: {
      id: string;
      path: string;
    } = await this.retrieveByFilename(filename);
    await Orm.files.deleteById(file.id);
    fs.unlinkSync(file.path);
  }
}
