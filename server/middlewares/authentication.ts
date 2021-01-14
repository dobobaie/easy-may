import * as express from 'express';

import { IConfig } from '../app/config';
import Provider from '../provider';

const verifyPrivateAccess = (
  request: express.Request,
  extraInfo?: Array<string> | undefined
): Promise<void> => {
  if (!request.meta.privateToken) {
    if (extraInfo?.includes('optional')) {
      return Promise.resolve();
    }
    throw new Error('private_token_query_is_missing');
  }
  if (
    request.meta.privateToken !==
    Provider.get<IConfig>('config').security.privateToken
  ) {
    throw new Error('invalid_private_token');
  }
  return Promise.resolve();
};

export const expressAuthentication = (
  request: express.Request,
  securities: string,
  extraInfo?: Array<string> | undefined
): Promise<void> => {
  switch (securities) {
    case 'privateAccess':
      return verifyPrivateAccess(request, extraInfo);
    default:
      return Promise.reject(new Error('internal_security_error'));
  }
};
