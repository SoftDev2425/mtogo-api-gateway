import express from 'express';
import routes from '../routes';
import { limiter } from './rateLimit';
import { logRequestDetails } from '../middleware/loggerMiddleware';
import cookieParser from 'cookie-parser';
import { jsonParseErrorHandler } from '../middleware/jsonParseErrorHandler';
import cors from 'cors';
import * as fs from 'fs';
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

export const MAX_SESSIONS = 5;

function createServer() {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: [process.env.CLIENT_URL ?? 'http://localhost:5173'],
    }),
  );
  app.use(express.json());
  app.use(jsonParseErrorHandler);
  app.use(cookieParser());

  const swaggerFilePath = path.resolve(__dirname, '../swagger/swagger.yaml');

  if (!fs.existsSync(swaggerFilePath)) {
    throw new Error(`Swagger file not found at ${swaggerFilePath}`);
  }

  const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
  const swaggerDocument = YAML.parse(swaggerFile);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(limiter);

  app.use(logRequestDetails);

  routes(app);

  return app;
}

export default createServer;
