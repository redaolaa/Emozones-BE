import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      currentUser?: any;  // or a more specific type if you know it, e.g., `User`
    }
  }
}