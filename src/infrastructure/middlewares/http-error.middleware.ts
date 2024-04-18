import { Request, Response, NextFunction } from 'express';
import { HttpBadRequestError } from '../exceptions/http-bad-request.error';

export class HttpErrorMiddleware {
  public static handle(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (error instanceof HttpBadRequestError)
      return res.status(400).json({ message: error.message });
    else if (error instanceof Error && error.message)
      return res.status(500).json({ message: error.message });

    return res.status(500).json({ message: 'Internal Server Error!' });
  }
}
