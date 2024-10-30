import express from 'express';
import routes from '../routes';
import { limiter } from './rateLimit';
import { logRequestDetails } from '../middleware/loggerMiddleware';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { redisClient } from '../redis/client';

function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using HTTPS !IMPORTANT
    }),
  );

  app.use(limiter);

  app.use(logRequestDetails);

  routes(app);

  return app;
}

export default createServer;
