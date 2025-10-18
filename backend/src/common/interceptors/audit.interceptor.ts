import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;
    const timestamp = new Date().toISOString();

    console.log(`[AUDIT] ${timestamp} - ${user?.email || 'Anonymous'} - ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => {
          console.log(`[AUDIT] ${timestamp} - SUCCESS - ${method} ${url}`);
        },
        error: (error) => {
          console.log(`[AUDIT] ${timestamp} - FAILED - ${method} ${url} - ${error.message}`);
        },
      }),
    );
  }
}