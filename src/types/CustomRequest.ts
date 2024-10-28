import { Request } from 'express';
import { Session } from 'express-session';

interface UserSession {
  user?: {
    email: string;
    role: string;
  };
}

export interface CustomRequest extends Request {
  session: Session & UserSession;
}
