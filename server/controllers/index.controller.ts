import { Controller, Get, Route } from 'tsoa';

// import * as packageJSON from '../../package.json';
const packageJSON: any = require('../../package.json');

interface IClassicReturn {
  message?: string;
  status?: string;
}

@Route('')
export class IndexController extends Controller {
  @Get('')
  public index(): IClassicReturn {
    return {
      message: `Welcome to ${packageJSON.name} ${packageJSON.version}`
    };
  }

  @Get('health')
  public health(): IClassicReturn {
    return {
      status: 'OK'
    };
  }
}
