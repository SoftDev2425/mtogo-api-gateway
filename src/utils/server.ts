import express from 'express';
import routes from '../routes';
import { limiter } from './rateLimit';
import { logRequestDetails } from '../middleware/loggerMiddleware';
import session from 'express-session';

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: true,
    }),
  );

  app.use(limiter);

  app.use(logRequestDetails);

  routes(app);

  return app;
}

export default createServer;
