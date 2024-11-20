import { Request, Response, NextFunction } from 'express';
import { parse } from 'cookie';

export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    const sessionId = cookies.session;

    if (!sessionId) {
      req.email = undefined;
      req.userId = undefined;
      req.role = undefined;
      return next();
    }

    const authResponse = await fetch(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      },
    );

    if (!authResponse.ok) {
      req.email = undefined;
      req.userId = undefined;
      req.role = undefined;
      return next();
    }

    const userData = (await authResponse.json()) as {
      message: string;
      email: string;
      userId: string;
      role: string;
    };

    req.email = userData.email;
    req.userId = userData.userId;
    req.role = userData.role;

    next();
  } catch (error) {
    console.error('Error in session middleware:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
