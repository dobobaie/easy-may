import { IMetaRequest } from '../backend-lib';

import FilesService from './files.service';

export { FilesService };

export class Services {
  public files: FilesService;

  constructor(meta?: IMetaRequest) {
    this.files = new FilesService(this, meta);
  }

  public setMeta(meta?: IMetaRequest): Services {
    return new Services(meta);
  }
}

export default new Services();
