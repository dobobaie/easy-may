export interface ICreateFile {
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface IRetrieveFile extends ICreateFile {
  id: string;
}

export interface IUpsertFile extends Partial<IRetrieveFile> {}

export interface IFileList {
  list: IRetrieveFile[];
}
