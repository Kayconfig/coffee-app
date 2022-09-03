import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Coffee } from 'src/coffees/entities/coffee.entity';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // modify the response returned from handlers
    return next.handle().pipe(map((data: Coffee) => ({ data })));
  }
}
