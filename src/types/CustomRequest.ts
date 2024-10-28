import { Request } from 'express';

interface UserSession {
  user?: {
    email: string;
    role: string;
  };
}

export interface CustomRequest extends Request {
  session: UserSession & {
    destroy: (cb: (err: Error) => void) => void;
  };
}
