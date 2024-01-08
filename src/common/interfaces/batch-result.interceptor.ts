import { BatchResult } from '@common/interfaces/index.interface';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BatchResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BatchResult> {
    return next.handle().pipe(map((result) => result as BatchResult));
  }
}
