import { Request, Response, NextFunction } from 'express';

function jsonParseErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('[ERROR]: JSON Syntax Error', err);
    return res.status(400).json({
      status: 400,
      message: 'Invalid JSON format',
    });
  }
  next();
}

export { jsonParseErrorHandler };
