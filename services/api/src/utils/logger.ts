import winston from 'winston';
import { env } from '../config/env';
const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format:
    env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.timestamp()
        ),
  transports: [new winston.transports.Console()],
});

export default logger;
