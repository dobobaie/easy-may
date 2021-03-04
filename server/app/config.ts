import * as path from 'path';

interface IStaticConfig {
  env: {
    default: string;
    available: Array<string | undefined>;
  };
  locale: {
    default: string;
    available: Array<string | undefined>;
  };
  storage: {
    path: string;
  };
  postgres: {
    port: number;
  };
  server: {
    timeout: string;
  };
  typeorm: {
    type: string;
    debug: boolean;
    synchronize: boolean;
    entities: Array<string>;
  };
  log: {
    defaultLevel: string;
    dailyRotateFile: {
      dirname: string;
      maxSize: string;
      maxFiles: number | null;
    };
    slack: {
      channel: string;
    };
  };
}

export interface IConfig {
  platformName: string;
  env: string;
  test_mode_enabled: boolean;
  locale: string;
  storage: {
    path: string;
  };
  security: {
    privateToken: string;
  };
  postgres: {
    url?: string;
    db?: string;
    user?: string;
    password?: string;
    port: number;
    ssl?: {
      enable?: boolean;
      ca?: string;
      key?: string;
      cert?: string;
    };
  };
  server: {
    timeout: string;
    port: number;
  };
  typeorm?: {
    type?: string;
    debug?: boolean;
    synchronize?: boolean;
    entities?: Array<string>;
  };
  log: {
    defaultLevel: string;
    dailyRotateFile: {
      dirname: string;
      maxSize: string;
      maxFiles: number | null;
    };
    slack: {
      channel: string;
      webhookUrl: string | undefined;
    };
  };
}

export default (env: NodeJS.ProcessEnv): IConfig => {
  const cstatic: IStaticConfig = {
    env: {
      default: 'development',
      available: ['development', 'staging', 'recette', 'production']
    },
    locale: {
      default: 'fr',
      available: ['fr', 'en']
    },
    storage: {
      path: path.join(__dirname, '../../tmp/uploaded')
    },
    postgres: {
      port: 5432
    },
    server: {
      timeout: '20s'
    },
    typeorm: {
      type: 'postgres',
      debug: false,
      synchronize: true,
      entities: [
        path.join(__dirname, '/../backend-lib/entities/cloud/*.entity.{js,ts}')
      ]
    },
    log: {
      defaultLevel: 'debug',
      dailyRotateFile: {
        dirname: path.join(__dirname, '../../tmp/logs'),
        maxFiles: null,
        maxSize: '20m'
      },
      slack: {
        channel: '#logger-preprod'
      }
    }
  };

  const cdynamic: IConfig = {
    platformName: env.PLATFORM_NAME || '',
    env:
      (cstatic.env.available.includes(env.ENV) && env.ENV) ||
      cstatic.env.default,
    test_mode_enabled: env.TEST_MODE_ENABLED === 'true',
    locale:
      (cstatic.locale.available.includes(env.LOCALE) && env.LOCALE) ||
      cstatic.locale.default,
    storage: {
      path: env.STORAGE_PATH || cstatic.storage.path
    },
    security: {
      privateToken: env.SECURITY_PRIVATE_TOKEN || ''
    },
    postgres: {
      url: env.POSTGRES_URL,
      db: env.POSTGRES_DB,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      port:
        Number.parseInt(env.POSTGRES_PORT || '', 10) || cstatic.postgres.port,
      ssl: {
        enable: !!(
          env.POSTGRES_SSL_CA ||
          env.POSTGRES_SSL_KEY ||
          env.POSTGRES_SSL_CERT
        ),
        ca: env.POSTGRES_SSL_CA,
        key: env.POSTGRES_SSL_KEY,
        cert: env.POSTGRES_SSL_CERT
      }
    },
    server: {
      timeout: env.SERVER_TIMEOUT || cstatic.server.timeout,
      port: Number.parseInt(env.SERVER_PORT || '', 10)
    },
    log: {
      defaultLevel: env.LOG_DEFAULT_LEVEL || cstatic.log.defaultLevel,
      dailyRotateFile: {
        dirname:
          env.LOG_DAILY_ROTATE_FILE_DIRNAME ||
          cstatic.log.dailyRotateFile.dirname,
        maxFiles:
          Number.parseInt(env.LOG_DAILY_ROTATE_FILE_MAX_FILES || '', 10) ||
          cstatic.log.dailyRotateFile.maxFiles,
        maxSize:
          env.LOG_DAILY_ROTATE_FILE_MAX_SIZE ||
          cstatic.log.dailyRotateFile.maxSize
      },
      slack: {
        channel: env.LOG_SLACK_CHANNEL || cstatic.log.slack.channel,
        webhookUrl: env.LOG_SLACK_WEBHOOKURL
      }
    }
  };

  if (
    !(
      cdynamic.platformName &&
      cdynamic.server.port &&
      cdynamic.postgres.url &&
      cdynamic.postgres.db &&
      cdynamic.postgres.user &&
      cdynamic.security.privateToken
    )
  ) {
    throw new Error('wrong_or_missing_configuration');
  }

  const config: IConfig = {
    ...cdynamic,
    typeorm: { ...cstatic.typeorm }
  };
  return config;
};
