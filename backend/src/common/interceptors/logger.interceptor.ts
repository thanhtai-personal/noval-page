import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl;

    return next.handle().pipe(
      tap(() => {
        const user = req.user;
        const log = `Interceptor: [${new Date().toISOString()}] ${
          user ? `| User: ${user.email} (${user.role})` : '| Public'
        }`;
        console.log(log);
      }),
    );
  }
}
