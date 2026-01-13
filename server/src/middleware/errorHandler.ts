import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err.message);

  // If validation error (should be handled in controllers, but fallback)
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  // Production: Generic error
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Development: Full details
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
};
