import { Express, NextFunction, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import { logger } from './utils/logger';
import AuthRouter from './routes/auth.routes';
import { authenticateSession } from './middleware/authenticateSession';

function routes(app: Express) {
  const basketServiceUrl =
    process.env.BASKET_SERVICE_URL || 'http://localhost:3001';
  const orderServiceUrl =
    process.env.ORDER_SERVICE_URL || 'http://localhost:3002';

  console.log(basketServiceUrl, orderServiceUrl);

  app.get('/', (_req: Request, res: Response) =>
    res.send(`Hello from MTOGO: API GATEWAY!`),
  );

  app.get('/healthcheck', (_req: Request, res: Response) =>
    res.sendStatus(200),
  );

  app.use('/api/auth', AuthRouter);

  app.use(
    '/api/basket',
    authenticateSession,
    proxy(basketServiceUrl, {
      proxyReqPathResolver: req => `/api/basket${req.url}`,
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
      res.status(500).send('Internal Server Error');
    } else {
      logger.error('An unknown error occurred', {
        method,
        url: originalUrl,
        ip,
      });
      res.status(500).send('An unknown error occurred');
    }
  });

  // Catch unregistered routes
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
