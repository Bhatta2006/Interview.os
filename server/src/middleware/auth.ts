import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const demoUser = req.headers['x-user-id'];

  if (!token) {
    // Allow Guest Mode if x-user-id is present (e.g. demo-user-id)
    if (demoUser === 'demo-user-id') {
      req.user = { userId: 'demo-user-id' };
      return next();
    }
    return res.status(401).json({ error: 'Null token' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
