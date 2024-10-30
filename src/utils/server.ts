import express from 'express';
import routes from '../routes';
import { limiter } from './rateLimit';
import { logRequestDetails } from '../middleware/loggerMiddleware';
import cookieParser from 'cookie-parser';
import { jsonParseErrorHandler } from '../middleware/jsonParseErrorHandler';

export const MAX_SESSIONS = 5;

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(jsonParseErrorHandler);
  app.use(cookieParser());

  app.use(limiter);

  app.use(logRequestDetails);

  routes(app);

  return app;
}

export default createServer;
