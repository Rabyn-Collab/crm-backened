import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter {
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ) {
    const response =
      host.switchToHttp().getResponse();

    const request =
      host.switchToHttp().getRequest();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.getResponse(),
    });
  }
}