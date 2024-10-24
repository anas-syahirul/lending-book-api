import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';

export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const errorMessages = exception.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      response.status(400).json({
        message: 'Validation Error',
        errors: errorMessages,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
