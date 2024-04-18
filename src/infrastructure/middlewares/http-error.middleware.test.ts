import { Request, Response, NextFunction } from 'express';
import { HttpBadRequestError } from '../exceptions/http-bad-request.error';
import { HttpErrorMiddleware } from './http-error.middleware';

describe('HttpErrorMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle HttpBadRequestError', () => {
    const error = new HttpBadRequestError('Bad request');
    HttpErrorMiddleware.handle(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Bad request' });
  });

  it('should handle other errors', () => {
    const error = new Error('Internal error');
    HttpErrorMiddleware.handle(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal error',
    });
  });

  it('should handle errors without message', () => {
    const error = new Error();
    HttpErrorMiddleware.handle(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext as NextFunction,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error!',
    });
  });
});
