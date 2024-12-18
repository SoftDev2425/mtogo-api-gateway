import { Express, NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import { logger } from './utils/logger';
import { validateSession } from './middleware/validateSession';

function routes(app: Express) {
  const authServiceURL =
    process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  const restaurantServiceURL =
    process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';

  const orderServiceURL =
    process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

  app.get('/', (_req: Request, res: Response) =>
    res.send(`Hello from MTOGO: API GATEWAY!`),
  );

  app.get('/healthcheck', async (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.use(
    '/api/auth',
    proxy(authServiceURL, {
      proxyReqPathResolver: req => `/api/auth${req.url}`,
    }),
  );

  app.use(
    '/api/restaurants',
    validateSession,
    proxy(restaurantServiceURL, {
      proxyReqPathResolver: req => `/api/restaurants${req.url}`,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          'x-user-role': srcReq.role || '',
          'x-user-id': srcReq.userId || '',
          'x-user-email': srcReq.email || '',
        };
        return proxyReqOpts;
      },
    }),
  );

  app.use(
    '/api/basket',
    validateSession,
    proxy(restaurantServiceURL, {
      proxyReqPathResolver: req => `/api/basket${req.url}`,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          'x-user-role': srcReq.role || '',
          'x-user-id': srcReq.userId || '',
          'x-user-email': srcReq.email || '',
        };
        return proxyReqOpts;
      },
    }),
  );

  app.use(
    '/api/orders',
    validateSession,
    proxy(orderServiceURL, {
      proxyReqPathResolver: req => `/api/orders${req.url}`,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          'x-user-role': srcReq.role || '',
          'x-user-id': srcReq.userId || '',
          'x-user-email': srcReq.email || '',
        };
        return proxyReqOpts;
      },
    }),
  );

  app.use(
    '/api/search',
    validateSession,
    proxy(restaurantServiceURL, {
      proxyReqPathResolver: req => `/api/search${req.url}`,
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          'x-user-role': srcReq.role || '',
          'x-user-id': srcReq.userId || '',
          'x-user-email': srcReq.email || '',
        };
        return proxyReqOpts;
      },
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const { method, originalUrl, ip } = req;

    if (err instanceof Error) {
      logger.error(`Error: ${err.message}`, {
        method,
        url: originalUrl,
        ip,
        stack: err.stack,
      });
      res.status(500).send({
        error: 'An error occurred in the API Gateway',
        message: err,
      });
    } else {
      logger.error('An unknown error occurred in the API Gateway', {
        method,
        url: originalUrl,
        ip,
      });
      res.status(500).send('An unknown error occurred in the API Gateway');
    }
  });

  // Catch unregistered routes
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
