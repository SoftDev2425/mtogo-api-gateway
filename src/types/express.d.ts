import 'express';

declare global {
  namespace Express {
    export interface Request extends Express.Request {
      email?: string;
      userId?: string;
      role?: string;
    }
  }
}
