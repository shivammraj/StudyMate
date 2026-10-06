import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[REQ] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${ms}ms)`);
  });
  next();
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[SERVER ERROR]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    ok: false,
    error: {
      code: err.code || 'INTERNAL',
      message: err.message || 'An unexpected internal server error occurred',
      retryable: err.retryable ?? true,
    },
  });
}
