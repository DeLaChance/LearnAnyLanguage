import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle()
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<any> {

    let exception: any;
    if (error.name === 'EntityNotFound') {
      exception = new NotFoundException(error.detail);
    } else if (error.name === 'QueryFailedError') {
      if (/^duplicate key value violates unique constraint/.test(error.message)) {
        exception = new BadRequestException(error.detail);
      } else if (/violates foreign key constraint/.test(error.message)) {
        exception = new BadRequestException(error.detail);
      } else if (/invalid input/.test(error.message)) {
        exception = new BadRequestException(error.detail);        
      } else {
        exception = new InternalServerErrorException(error.detail);
      }
    }

    console.log(`Mapping error ${error} to HttpResponse ${exception}`);

    return throwError(exception);
  }
}