import { CustomRequest } from '../types/CustomRequest';
import { Response, NextFunction } from 'express';

function authenticateSession(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  console.log(req.session);
  console.log(req.session.user);

  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export { authenticateSession };
